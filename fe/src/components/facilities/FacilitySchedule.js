import React, { useEffect, useState } from 'react'
import { deleteSchedule, listSchedule, saveSchedule, updateSchedule } from '../api/facilities/facilityApi';

const FacilitySchedule = () => {
    const [schedule, setSchedule] = useState({
        facilityName: "",
        startTime: "",
        endTime: ""
    });
    const [scheduleList, setScheduleList] = useState([]);
    const [editMode, setEditMode] = useState(null)
    const role = localStorage.getItem("role")

    useEffect(() => {
        //스케줄 데이터 불러오기
        const fetchSchedule = async () => {
            try {
                const response = await listSchedule()
                setScheduleList(response.data);
            } catch (error) {
                console.error('스케줄 조회중 오류발생: ', error);
            }
        };
        fetchSchedule();
    }, []);

    const handleSave = async () => {
        try {
            if (editMode) {
                await updateSchedule(editMode.id, schedule);
                alert("시설별 이용시간이 수정되었습니다");
            } else {
                await saveSchedule(schedule);
                alert("입력하신 시설별 이용시간이 저장되었습니다!");
            }
            setSchedule({ facilityName: "", startTime: "", endTime: "" }); // 입력 폼 초기화
            setEditMode(null);
            const response = await listSchedule();
            setScheduleList(response.data)

        } catch (error) {
            console.error("스케줄 저장 중 오류 발생:", error);
            alert("스케줄 저장에 실패했습니다.");
        }
    };

    const handleEdit = (item) => {
        setEditMode(item);
        setSchedule({
            facilityName: item.facilityName,
            startTime: item.startTime,
            endTime: item.endTime,
        });
    }

    const handleDelete = async (id) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await deleteSchedule(id);
                alert("시설별 이용시간이 삭제되었습니다.")
                const response = await listSchedule();
                setScheduleList(response.data); //삭제후 리스트 갱신
            } catch (error) {
                console.error("스케줄 삭제중 오류 발생: ", error)
                alert("스케줄 삭제에 실패했습니다.")
            }
        }

    }

    return (
        <div>
            {role === 'ADMIN' && (
                <>
                    <h1>시설별 이용시간 공지 등록</h1>
                    <div style={{ marginBottom: "20px" }}>
                        <input
                            type="text"
                            placeholder="시설명"
                            value={schedule.facilityName}
                            onChange={(e) => setSchedule({ ...schedule, facilityName: e.target.value })}
                            style={{ marginRight: "10px", padding: "5px" }}
                        />
                        <input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
                            style={{ marginRight: "10px", padding: "5px" }}
                        />
                        <input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) => setSchedule({ ...schedule, endTime: e.target.value })}
                            style={{ marginRight: "10px", padding: "5px" }}
                        />
                        <button onClick={handleSave} style={{ padding: "5px 10px", backgroundColor: "#4CAF50", color: "white" }}>
                            {editMode ? "수정" : "저장"}
                        </button>
                    </div>
                </>
            )}

            <h2>시설별 이용시간 안내</h2>
            {scheduleList.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>시설</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>시작 시간</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>종료 시간</th>
                            {role === "ADMIN" && <th style={{ border: "1px solid #ddd", padding: "8px" }}>작업</th>}


                        </tr>
                    </thead>
                    <tbody>
                        {scheduleList.map((item) => (
                            <tr key={item.id}>
                                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{item.facilityName}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{item.startTime}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{item.endTime}</td>
                                {role === "ADMIN" && (
                                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "#2196F3", color: "white" }}
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            style={{ padding: "5px 10px", backgroundColor: "#f44336", color: "white" }}
                                        >
                                            삭제
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>등록된 시간이 없습니다.</p>
            )}
        </div>
    )
}

export default FacilitySchedule