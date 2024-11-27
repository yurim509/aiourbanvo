const GymProgramState = ({ reservations, isParticipant, handleCancel, listTitle }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">{listTitle}</h2>

            <div className="grid grid-cols-7 gap-4 font-semibold text-sm text-gray-700 bg-gray-100 p-2 rounded-lg">
                <div>NO</div>
                <div>시작일</div>
                <div>종료일</div>
                <div>프로그램명</div>
                <div>프로그램상태</div>
                <div>신청자</div>
                <div>신청취소</div>
            </div>

            <div className="overflow-y-auto max-h-96">
                {reservations && reservations.length > 0 ? (
                    reservations.map((gym) => (
                        <div key={gym.programId} className="grid grid-cols-7 gap-4 items-center border-t py-4">
                            <div className="text-sm">{gym.programId}</div>
                            <div className="text-sm">{gym.programStartDate}</div>
                            <div className="text-sm">{gym.programEndDate}</div>
                            <div className="text-sm">{gym.title}</div>
                            <div className="text-sm">{gym.programState}</div>

                            <div className="text-sm">
                                {gym.participants && gym.participants.length > 0 ? (
                                    gym.participants.map((participant) => (
                                        <div key={participant.uno} className="flex flex-col">
                                            <span>{participant.userName}</span>
                                            {/* <span>{participant.phone}</span> */}
                                        </div>
                                    ))
                                ) : (
                                    <span>예약자 없음</span>
                                )}
                            </div>

                            <div className="flex justify-center items-center space-x-4 mt-4">
                                {isParticipant && (
                                    <button
                                        type="button"
                                        onClick={() => handleCancel(gym.programId)}
                                        className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                    >
                                        취소
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 col-span-7">신청 정보가 없습니다.</div>
                )}
            </div>
        </div>
    );
};
export default GymProgramState