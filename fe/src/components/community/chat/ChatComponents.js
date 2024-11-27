import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sendMessage, getMessages, getProductByMno } from '../../api/community/ChatApi';

const ChatComponent = () => {
    const { mno } = useParams();
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [recentMessage, setRecentMessage] = useState(null);
    const [postDetails, setPostDetails] = useState(null);
    const [receiverId, setReceiverId] = useState(null);
    const [senderId, setSenderId] = useState(null);
    const [senderName, setSenderName] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const loggedInUserId = localStorage.getItem('uno');
        setSenderId(loggedInUserId);
        const userName = localStorage.getItem('userName');
        setSenderName(userName);

        const fetchPostDetails = async () => {
            try {
                const data = await getProductByMno(mno);
                setPostDetails(data);
                setReceiverId(data.userId);
                setReceiverName(data.userName);

                const messages = await getMessages(mno);
                console.log(message)
                setChat(messages);
            } catch (error) {
                console.error('게시물 데이터 가져오기 실패:', error);
            }
        };

        if (mno) {
            fetchPostDetails();
        }

        const ws = new WebSocket(`ws://localhost:8080/ws/chat`);
        ws.onopen = () => console.log('WebSocket 연결 성공');
        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            // 중복 메시지 처리
            if (!(newMessage.senderId === senderId && newMessage.message === message)) {
                setChat((prevChat) => [...prevChat, newMessage]);
            }
        };
        ws.onclose = () => console.log('WebSocket 연결 종료');
        setSocket(ws);

        return () => {
            if (ws) ws.close();
        };
    }, [mno, message, senderId]);

    const handleSendMessage = async () => {
        if (message && receiverId && senderId) {
            const chatMessage = {
                productId: mno,
                senderId,
                recipientId: receiverId,
                message,
                timestamp: new Date().toISOString(),
                senderName
            };


            // 클라이언트에서 즉시 렌더링
            setChat((prevChat) => [...prevChat, chatMessage]);
            setRecentMessage(chatMessage);

            try {
                await sendMessage(chatMessage);
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(chatMessage));
                }
                setMessage('');
            } catch (error) {
                console.error('메시지 전송 실패:', error);
            }
        }
    };

    const isSeller = senderId == postDetails?.userId;

    return (
        <div className="flex flex-col items-center max-w-lg mx-auto p-6">
            <div className="w-full">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {isSeller ? '판매자 채팅 화면' : '구매자 채팅 화면'}
                </h2>
                {postDetails && (
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold mb-2">상품명: {postDetails.title}</h2>
                        <p className="text-gray-600">가격: {postDetails.price}원</p>
                        <p className="text-gray-500">설명: {postDetails.content}</p>
                    </div>
                )}
                <div className="w-full h-96 border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-y-scroll">
                    {chat.map((msg, index) => {
                        console.log(msg)
                        const isMessageFromSeller = msg.senderId === postDetails?.userId;
                        const isPreviousMessageFromSameUser = index > 0 && chat[index - 1].senderId === msg.senderId;

                        return (
                            <div
                                key={index}
                                className={`flex flex-col ${isMessageFromSeller ? 'items-end' : 'items-start'} mb-4`}
                            >
                                {!isPreviousMessageFromSameUser && (
                                    <span className="text-xs text-gray-500 mb-1">
                                        {/* {isMessageFromSeller ? msg.receiverName : msg.senderName} 오른쪽은 receiverName, 왼쪽은 senderName 표시 */}
                                    </span>
                                )}
                                <div
                                    className={`p-3 rounded-lg max-w-xs ${isMessageFromSeller
                                        ? 'bg-green-200 text-right' // 판매자의 메시지는 초록색
                                        : 'bg-blue-200 text-left' // 구매자의 메시지는 파란색
                                        }`}
                                >
                                    <p className="text-sm">{msg.message}</p>
                                    <small className="text-gray-500 text-xs">
                                        {isMessageFromSeller ? receiverName : msg.senderName} {/* 오른쪽은 receiverName, 왼쪽은 senderName 표시 */}
                                        <br />

                                        {new Date(msg.timestamp).toLocaleString()}
                                    </small>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {recentMessage && (
                    <div className="w-full p-4 mt-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                        <p className="text-sm font-semibold text-gray-800">방금 전 보낸 메시지:</p>
                        <p className="text-sm text-gray-600">{recentMessage.message}</p>
                        <small className="text-xs text-gray-500">
                            {new Date(recentMessage.timestamp).toLocaleString()}
                        </small>
                    </div>
                )}
            </div>

            <div className="flex items-center w-full mt-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메세지를 입력하세요"
                    className="flex-1 p-2 border border-gray-300 rounded-lg mr-2 focus:outline-none"
                />
                <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    메세지 보내기
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
