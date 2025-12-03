import User from '@/components/common/User';
import Color from '@/components/common/Color';
import { useState } from 'react';
import Tag from '@/components/common/Tag';
import Dropdown from '@/components/common/Dropdown';
import Progress from '@/components/common/Progress';

export default function Common() {
  const colorOptions = [
    { colorValue: '#7ac555', colorName: 'green' },
    { colorValue: '#760dde', colorName: 'purple' },
    { colorValue: '#ffa500', colorName: 'orange' },
    { colorValue: '#76a5ea', colorName: 'blue' },
    { colorValue: '#e876ea', colorName: 'pink' },
  ];
  const [value, setValue] = useState({
    color: '',
  });
  const handleColorChange = (val) => {
    setValue((prev) => ({
      ...prev,
      color: val,
    }));
  };
  const [value2, setValue2] = useState({
    color: '#7ac555',
  });
  const handleColorChange2 = (val) => {
    setValue2((prev) => ({
      ...prev,
      color: val,
    }));
  };

  const [viewTags, setViewTags] = useState(['프로젝트', '일반', '백엔드']); // 태그 상세

  //드롭다운
  const progress = ['To Do', 'On Progress', 'Done'];
  const manager = ['홍길동', '배유철'];
  const [managerValue, setManagerValue] = useState('이름을 입력해 주세요');
  const [managerValue2, setManagerValue2] = useState(manager[1]);
  const [progressValue2, setProgressValue2] = useState(progress[1]);
  return (
    <>
      <h1>User Examples</h1>
      <section>
        Dropdown : <User value="홍길동" />
        <br />
        할일카드 모달 type=medium : <User value="이영희" type="medium" />
        <br />
        할일상세 댓글 type=comment :
        <div
          style={{
            position: 'relative',
            paddingLeft: '44px',
            display: 'inline-block',
            height: '36px',
          }}
        >
          <User value="이영희" type="comment" />
        </div>
        <br />
        헤더 프로필 / 구성원 type=large : <User value="이영희" type="large" />
        <br />
        카드 목록 hiddenName=true : <User value="김철수" hiddenName="true" />
        <br />
        헤더 유저 :
        <div className="userGroup">
          <User value="김철수" type="large" hiddenName="true" />
          <User value="홍길동" type="large" hiddenName="true" />
          <User value="배유철" type="large" hiddenName="true" />
          <User value="윤지현" type="large" hiddenName="true" />
          <User value="정만철" type="large" hiddenName="true" />
          <User value="정만철" type="large" hiddenName="true" />
        </div>
      </section>
      <br />
      <br />
      <h1>Color Examples</h1>
      <section>
        대피보드 생성 :
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
        <br />
        대피보드 수정 :
        <div className="ColorWrap">
          {colorOptions.map((option) => {
            const { colorValue, colorName } = option;
            return (
              <Color
                key={colorName}
                value={colorValue}
                color={colorName}
                name="colorGrp2"
                onChange={handleColorChange2}
                selected={value2.color}
              />
            );
          })}
        </div>
      </section>
      <br />
      <br />
      <h1>Tag Examples</h1>
      <section>
        할일상세 모달 / 할일수정 모달 / 카드 :
        {viewTags.map((item, index) => {
          return (
            <Tag key={index} index={index}>
              {item}
            </Tag>
          );
        })}
      </section>
      <br />
      <br />
      <h1>Progress Examples</h1>
      <section>
        할일상세 모달 / Dropdown :
        <Progress value={'To Do'} />
      </section>
      <br />
      <br />
      <h1>Dropdown Examples</h1>
      <section>
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
      </section>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}
