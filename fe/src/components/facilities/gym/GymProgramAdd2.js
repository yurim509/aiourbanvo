import React, { useRef, useState } from 'react'
import { postAdd } from '../../api/facilities/gymApi';
import FetchingModal from '../common/FetchingModal';
import { useNavigate } from 'react-router-dom';


const initState = {
  title: "",
  content: "",
  target: "",
  programStartDate: "",
  programEndDate: "",
  programStartTime: "",
  programEndTime: "",
  applicationStartDate: "",
  applicationEndDate: "",
  participantLimit: "",
  price: "",
};

const GymProgramAdd = () => {
  const navigate = useNavigate();
  const [program, setProgram] = useState(initState)
  const uploadRef = useRef()
  const [fetching, setFetching] = useState(false);


  const handleChangeProgram = (e) => {
    const { name, value } = e.target;
    setProgram((prevProgram) => ({ ...prevProgram, [name]: value }));
  };
  const handleClickAdd = async () => {
    const files = uploadRef.current.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    Object.entries(program).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      const response = await postAdd(formData);
      console.log('Program Added : ', response);
    } catch (error) {
      console.error('Error adding program: ', error)
    }

    navigate(`/facilities/gym/list`);
  };


  return (
    <>
      {fetching ? <FetchingModal /> : <></>}
      <div>
        <div>프로그램명 :
          <input
            name='title'
            type={'text'}
            value={program.title}
            onChange={handleChangeProgram}>
          </input>
        </div>
      </div>
      <div>
        <div>
          세부내용 :
        </div>
        <textarea
          name='content'
          row='3'
          onChange={handleChangeProgram}
          value={program.content}>
          {program.content}
        </textarea>
      </div>
      <div>
        <div>
          대상 :
        </div>
        <textarea
          name='target'
          row='2'
          onChange={handleChangeProgram}
          value={program.target}>
          {program.target}
        </textarea>
      </div>
      <div>
        <div>
          모집정원 :
        </div>
        <input
          name='participantLimit'
          type={'number'}
          onChange={handleChangeProgram}
          value={program.participantLimit}>
        </input>명
      </div>
      <div>
        <div>
          진행기간 :
        </div>
        <input
          type="date"
          name="programStartDate"
          onChange={handleChangeProgram}
          value={program.programStartDate}
        />

        ~

        <input
          type="date"
          name="programEndDate"
          onChange={handleChangeProgram}
          value={program.programEndDate}
        />
      </div>
      <div>
        <div>
          진행시간 :
        </div>
        <input
          type="time"
          name="programStartTime"
          onChange={handleChangeProgram}
          value={program.programStartTime}
        />

        ~

        <input
          type="time"
          name="programEndTime"
          onChange={handleChangeProgram}
          value={program.programEndTime}
        />
      </div>
      <div>
        <div>
          접수기간 :
        </div>
        <input
          type="datetime-local"
          name="applicationStartDate"
          onChange={handleChangeProgram}
          value={program.applicationStartDate}
        />

        ~

        <input
          type="datetime-local"
          name="applicationEndDate"
          onChange={handleChangeProgram}
          value={program.applicationEndDate}
        />
      </div>
      <div>
        <div>
          금액(마일리지,포인트중에 결정하고 마저 구현할것):
        </div>
        <input
          name='price'
          type={'number'}
          onChange={handleChangeProgram}
          value={program.price}>
        </input>원
      </div>
      {/* <div>
        <div>
          Files
        </div>
        <input ref={uploadRef}
          type={'file'}
          multiple />
      </div> */}
      <div>
        <button type='button'
          onClick={handleClickAdd}>
          등록하기
        </button>
      </div>
    </>
  )
}

export default GymProgramAdd;