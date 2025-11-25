import { useState } from 'react';
import { useModal } from '@/context/modalProvider';
import Input from '@/components/input/Input';
import Modal from '@/components/modal/Modal';
import Color from '@/components/common/Color';
import Textarea from '@/components/input/Textarea';
import ImgUpload from '@/components/input/ImgUpload';
import Dropdown from '@/components/modal/Dropdown';
import InputTag from '@/components/input/InputTag';
import Progress from '@/components/common/Progress';

import styles from '@/components/modal/Modal.module.scss';
import Image from 'next/image';
import User from '@/components/common/User';
import Tag from '@/components/common/Tag';

export default function Modals() {
  /* 모달 관련 */
  const { isOpen, openModal, closeModal } = useModal();
  const handleModalSubmit = (e) => {
    console.log('폼전송');
  };
  /* Input 관련 */
  const [value, setValue] = useState({
    title: '',
    email: '',
    color: '',
    dashboardname: '',
  });
  const [value2, setValue2] = useState({
    title: '할일 제목이 들어옵니다.',
    detail:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum finibus nibh arcu, quis consequat ante cursus eget. Cras mattis, nulla non laoreet porttitor, diam justo laoreet eros, vel aliquet diam elit at leo.',
    date: new Date(2025, 9, 29, 19, 30),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setValue2((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // 컬러값
  const colorOptions = [
    { colorValue: '#7ac555', colorName: 'green' },
    { colorValue: '#760dde', colorName: 'purple' },
    { colorValue: '#ffa500', colorName: 'orange' },
    { colorValue: '#76a5ea', colorName: 'blue' },
    { colorValue: '#e876ea', colorName: 'pink' },
  ];
  const handleColorChange = (val) => {
    setValue((prev) => ({
      ...prev,
      color: val,
    }));
  };

  // 태그
  const [tags, setTags] = useState([]); // 태그 생성
  const [tags2, setTags2] = useState(['프로젝트', '일반', '백엔드']); // 태그 수정
  const [viewTags, setViewTags] = useState(['프로젝트', '일반', '백엔드']); // 태그 상세

  //이미지
  const [cardImg, setCardImg] = useState('');
  const [cardImg2, setCardImg2] = useState('/images/temp/image01.svg');

  //드롭다운
  const progress = ['To Do', 'On Progress', 'Done'];
  const manager = ['홍길동', '배유철'];
  const [managerValue, setManagerValue] = useState('이름을 입력해 주세요');
  const [managerValue2, setManagerValue2] = useState(manager[1]);
  const [progressValue2, setProgressValue2] = useState(progress[1]);

  /* Textarea */
  const handleTextSubmit = () => {};
  /* 모달 sub button */
  const handleColumnDelete = () => {};

  return (
    <>
      <h1>Modal Examples</h1>
      <button onClick={() => openModal('confirmModal')}>Confirm 모달</button>
      <br />
      <button onClick={() => openModal('alertModal')}>Alert 모달</button>
      <br />
      <button onClick={() => openModal('createDashboardModal')}>새로운 대시보드 버튼</button>
      <br />
      <button onClick={() => openModal('createColumnModal')}>새 컬럼 생성 버튼</button>
      <br />
      <button onClick={() => openModal('editColumnModal')}>컬럼 관리 버튼</button>
      <br />
      <button onClick={() => openModal('inviteModal')}>초대하기 버튼</button>
      <br />
      <button onClick={() => openModal('createTodoModal')}>할 일 생성 버튼</button>
      <br />
      <button onClick={() => openModal('updateTodoModal')}>할 일 수정 버튼</button>
      <br />
      <button onClick={() => openModal('detailTodoModal')}>할 일 상세 버튼</button>
      <br />

      {/* 할 일 상세 모달 */}
      <Modal
        variant="type2"
        id="detailTodoModal"
        isOpen={isOpen('detailTodoModal')}
        closeModal={closeModal}
        onClick={handleModalSubmit}
        title="할일 제목이 들어옵니다."
      >
        <div className={styles.todoDetail}>
          <ul className={styles.infoBox}>
            <li>
              <em className={styles.tit}>담당자</em>
              <span className={styles.data}>
                <User value="배유철" type="medium" />
              </span>
            </li>
            <li>
              <em className={styles.tit}>마감일</em>
              <span className={styles.data}>2022.12.30 19:00</span>
            </li>
          </ul>
          <div className={styles.detail}>
            <div className={styles.state}>
              <div className={styles.todoProgress}>
                <Progress value={'To Do'} />
              </div>
              <div className={styles.todoTag}>
                {viewTags.map((item, index) => {
                  return (
                    <Tag key={index} index={index}>
                      {item}
                    </Tag>
                  );
                })}
              </div>
            </div>
            <div className={styles.content}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum finibus nibh arcu,
              quis consequat ante cursus eget. Cras mattis, nulla non laoreet porttitor, diam justo
              laoreet eros, vel aliquet diam elit at leo.
            </div>
            <div className={styles.image}>
              <Image src="/images/temp/image03.svg" fill alt="" />
            </div>

            <div className={styles.commnetBox}>
              <Textarea
                label="댓글"
                id="commnet"
                name="commnet"
                value={value.commnet || ''}
                placeholder="댓글 작성하기"
                onChange={handleChange}
                onClick={handleTextSubmit}
              />
              <ul className={styles.commnetList}>
                <li>
                  <div className={styles.info}>
                    <User value="배유철" type="comment" />
                    <p className={styles.date}>2022.12.27 14:00</p>
                  </div>
                  <div className={styles.commnet}> 오늘안에 CCC 까지 만들 수 있을까요?</div>
                  <div className={styles.btns}>
                    <button>수정</button>
                    <button>삭제</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>

      {/* 할 일 수정 모달 */}
      <Modal
        variant="type1"
        id="updateTodoModal"
        isOpen={isOpen('updateTodoModal')}
        closeModal={closeModal}
        onClick={handleModalSubmit}
        title="할 일 수정"
        secondaryBtn="취소"
        primaryBtn="수정"
      >
        <div className="dropDownWrap">
          <Dropdown
            type="progress"
            label="상태"
            content={progress}
            onChange={setProgressValue2}
            initValue={progressValue2}
          />
          <Dropdown
            type="manager"
            label="담당자"
            content={manager}
            onChange={setManagerValue2}
            initValue={managerValue2}
          />
        </div>
        <Input
          label="제목"
          type="text"
          id="title"
          name="title"
          placeholder="제목을 입력해주세요"
          onChange={handleChange2}
          value={value2.title}
          required
        />
        <Textarea
          label="설명"
          id="detail"
          name="detail"
          value={value2.detail || ''}
          placeholder="설명을 입력해 주세요"
          onChange={handleChange2}
          required
        />
        <Input
          label="마감일"
          type="date"
          id="date2"
          name="date2"
          startDate={value2.date}
          onChange={(date) => setValue2((prev) => ({ ...prev, date }))}
        />
        <InputTag tags={tags2} setTags={setTags2} />
        <ImgUpload type="card" setImg={setCardImg2} img={cardImg2} label="이미지" update />
      </Modal>

      {/* 할 일 생성 모달 */}
      <Modal
        variant="type1"
        id="createTodoModal"
        isOpen={isOpen('createTodoModal')}
        closeModal={closeModal}
        onClick={handleModalSubmit}
        title="할 일 생성"
        secondaryBtn="취소"
        primaryBtn="생성"
      >
        <Dropdown
          type="manager"
          label="담당자"
          content={manager}
          onChange={setManagerValue}
          initValue={managerValue}
        />
        <Input
          label="제목"
          type="text"
          id="title"
          name="title"
          placeholder="제목을 입력해주세요"
          onChange={handleChange}
          value={value.title}
          required
        />
        <Textarea
          label="설명"
          id="detail"
          name="detail"
          value={value.detail || ''}
          placeholder="설명을 입력해 주세요"
          onChange={handleChange}
          required
        />
        <Input
          label="마감일"
          type="date"
          id="date"
          name="date"
          startDate={value.date}
          onChange={(date) => setValue((prev) => ({ ...prev, date }))}
        />
        <InputTag tags={tags} setTags={setTags} />
        <ImgUpload type="card" setImg={setCardImg} img={cardImg} label="이미지" />
      </Modal>

      {/* 새로운 대시보드 모달 */}
      <Modal
        variant="type1"
        id="createDashboardModal"
        isOpen={isOpen('createDashboardModal')}
        closeModal={closeModal}
        onClick={handleModalSubmit}
        title="새로운 대시보드"
        secondaryBtn="취소"
        primaryBtn="생성"
      >
        <Input
          label="대시보드 이름"
          type="text"
          id="dashboardname"
          name="dashboardname"
          placeholder="대시보드 이름을 입력해주세요"
          onChange={handleChange}
          value={value.dashboardname}
        />
        <div className="ColorWrap">
          {colorOptions.map((option) => {
            const { colorValue, colorName } = option;
            return (
              <Color
                key={colorName}
                value={colorValue}
                color={colorName}
                name="colorGrp"
                onChange={handleColorChange}
                selected={value.color}
              />
            );
          })}
        </div>
      </Modal>

      {/* 초대하기 모달 */}
      <Modal
        variant="default"
        id="inviteModal"
        isOpen={isOpen('inviteModal')}
        closeModal={closeModal}
        onClick={handleModalSubmit}
        title="초대하기"
        secondaryBtn="취소"
        primaryBtn="생성"
      >
        <Input
          label="이메일"
          type="email"
          id="email"
          name="email"
          placeholder="이메일을 입력해주세요"
          onChange={handleChange}
          value={value.email}
        />
      </Modal>

      {/* 컬럼 관리 모달 */}
      <Modal
        variant="default"
        id="editColumnModal"
        isOpen={isOpen('editColumnModal')}
        closeModal={closeModal}
        onClick={handleModalSubmit}
        onSubClick={handleColumnDelete}
        title="컬럼 관리"
        secondaryBtn="삭제"
        primaryBtn="변경"
      >
        <Input
          label="이름"
          type="text"
          id="title"
          name="title"
          placeholder="이름을 입력해주세요"
          onChange={handleChange}
          value={value.title}
        />
      </Modal>

      {/* 새 컬럼 생성 모달 */}
      <Modal
        variant="default"
        id="createColumnModal"
        isOpen={isOpen('createColumnModal')}
        closeModal={closeModal}
        onClick={handleModalSubmit}
        title="새 컬럼 생성"
        secondaryBtn="취소"
        primaryBtn="생성"
      >
        <Input
          label="이름"
          type="text"
          id="title"
          name="title"
          placeholder="이름을 입력해주세요"
          onChange={handleChange}
          value={value.title}
        />
      </Modal>

      {/* Alert */}
      <Modal
        variant="alert"
        id="alertModal"
        isOpen={isOpen('alertModal')}
        closeModal={closeModal}
        primaryBtn="확인"
      >
        비밀번호가 일치하지 않습니다.
      </Modal>

      {/* Confirm */}
      <Modal
        variant="confirm"
        id="confirmModal"
        isOpen={isOpen('confirmModal')}
        closeModal={closeModal}
        onClick={handleModalSubmit}
        secondaryBtn="취소"
        primaryBtn="삭제"
      >
        컬럼의 모든 카드가 삭제됩니다.
      </Modal>
    </>
  );
}
