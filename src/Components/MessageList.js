import React, { Component } from 'react';
import Moment from 'react-moment';


class MessageList extends Component{
  constructor(props){
    super(props);
    this.state = {
      messages: [{
        username: '',
        content: '',
        sentAt: '',
        roomId: ''
      }],
      activeMessages: [],
      content: ''
    };

    this.messageRef = this.props.firebase.database().ref('messages');
  }


  createNewMessage(e){
    e.preventDefault();
    const content = this.state.content;
    this.messageRef.push({
      content: content,
      roomId: this.props.activeRoom.key,
      username: this.props.currentUser,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP
    });
    this.setState({ content: ''});
  }


  getMessageChange(e){

    this.setState({ content:  e.target.value });

  }

  updateActiveMessageList(activeRoom, message) {
    if(!activeRoom) {return};
    this.setState({activeMessages: this.state.messages.filter(message => message.roomId === activeRoom.key)})
  }


  componentWillReceiveProps(nextProps) {
    this.updateActiveMessageList(nextProps.activeRoom);
  }

  componentDidMount(activeRoom) {
    this.messageRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat( message ), activeMessages: this.state.activeMessages.concat( message ) })
    });

  }


  render(){
    return(
      <div className="messageParts">
        <h2>Active Room:{this.props.activeRoom.name}</h2>
        <div className="messageList">{this.state.activeMessages.map((message, index)=>
          <ul  key={index}>
            <li><h3>User:{message.username}</h3></li>
            <li><Moment format='lll'>{message.sentAt}</Moment></li>
            <li>{message.content}</li>
          </ul>

        )}

        </div>
        <section className="messageForm">
          <form className="newMessage" onSubmit={(e) => this.createNewMessage(e)}>
            <label>
              <input type="text" placeholder="Write Your Message" value={this.state.content} onChange={(e)=>this.getMessageChange(e)}/>
            </label>
            <input type="submit" value="Send Message"/>
          </form>
        </section>
      </div>

    );
  }
}




export default MessageList;
