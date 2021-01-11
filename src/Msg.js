import React, { useState, useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import { firebaseConfig } from './config';
const Msg = () => {
	const [isConnected, updateIsconnected] = useState(false);
	const [database, updateDatabase] = useState(null);
	const [myId, updateMyId] = useState('');
	const [receiverId, updateReceiverId] = useState('');
	const [message, updateMessage] = useState('');
	const [messages, updateMessages] = useState([]);

	useEffect(() => {
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		} else {
			firebase.app();
		}
		updateDatabase(firebase.database());
	});
	const connect = async () => {
		try {
			await database.ref('/notifs/' + myId).remove();
			await database.ref('/notifs/' + myId).on('value', (snapshot) => {
				if (snapshot.exists()) {
					const notif = snapshot.val();
					updateMessages((prev) => [...prev, notif]);
				}
			});
			updateIsconnected(true);
		} catch (err) {
			console.log(err);
		}
	};
	const sendMessage = async () => {
		try {
			await database.ref('/notifs/' + receiverId).set({
				message,
				from: myId,
			});
			updateMessage('');
		} catch (err) {
			console.log(err);
		}
	};
	const renderMessages = (value, key) => {
		return (
			<div key={key}>
				Message from : {value.from} : {value.message}
			</div>
		);
	};
	return (
		<div>
			{isConnected ? (
				<>
					<h3>Send a message</h3>
					<input
						placeholder='to'
						value={receiverId}
						onChange={(e) => updateReceiverId(e.target.value)}
					/>
					<input
						placeholder='message'
						value={message}
						onChange={(e) => updateMessage(e.target.value)}
					/>
					<button onClick={sendMessage}>Send</button>
					<div>
						Recieved Messages:
						<br />
						{messages.map(renderMessages)}
					</div>
				</>
			) : (
				<>
					<h3>What is your id </h3>
					<input
						value={myId}
						onChange={(e) => {
							updateMyId(e.target.value);
						}}
					/>
					<button onClick={connect}>Connect</button>
				</>
			)}
		</div>
	);
};

export default Msg;
