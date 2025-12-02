import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './Card.module.scss';
import TextCard from './TextCard';

export default function Card({ cardId, imageUrl, title, tags, date, assignee, onClick }) {
  const [imageError, setImageError] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0, time: 0 });
  const hasMovedRef = useRef(false);

  // URL 정규화 (프록시 없이 직접 표시)
  const normalizedUrl = useMemo(() => {
    if (!imageUrl) return null;

    const CDN = 'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com';

    // 이미 완전한 URL인 경우 그대로 사용
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // 상대 경로인 경우 CDN URL로 변환
    return `${CDN}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }, [imageUrl]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cardId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'pointer',
  };

  // 마우스 다운 시 시작 위치와 시간 기록
  const handleMouseDown = (e) => {
    clickStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    hasMovedRef.current = false;
  };

  // 마우스 이동 시 드래그 여부 확인
  const handleMouseMove = (e) => {
    if (!clickStartRef.current.time) return;
    const distance = Math.sqrt(
      Math.pow(e.clientX - clickStartRef.current.x, 2) +
        Math.pow(e.clientY - clickStartRef.current.y, 2),
    );
    if (distance > 5) {
      hasMovedRef.current = true;
    }
  };

  // 클릭 처리 (드래그가 아닐 때만)
  const handleClick = (e) => {
    // 드래그 중이 아니고, 실제로 클릭인 경우에만 처리
    if (!isDragging && !hasMovedRef.current && onClick) {
      const clickDuration = Date.now() - clickStartRef.current.time;
      // 클릭 시간이 300ms 이내이고 이동 거리가 5px 이내인 경우만 클릭으로 처리
      if (clickDuration < 300) {
        onClick(e);
      }
    }
    // 클릭 후 상태 초기화
    clickStartRef.current = { x: 0, y: 0, time: 0 };
    hasMovedRef.current = false;
  };

  // 이미지 URL이 없으면 텍스트 카드만 표시
  if (!normalizedUrl) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <TextCard title={title} tags={tags} date={date} assignee={assignee} />
      </div>
    );
  }

  // 이미지 URL이 있으면 이미지 영역 포함
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={styles.imageCard}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className={styles.imageWrapper}>
        {normalizedUrl && !imageError ? (
          <Image
            src={normalizedUrl}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.placeholder}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 13.3333C22.7614 13.3333 25 15.5719 25 18.3333C25 21.0948 22.7614 23.3333 20 23.3333C17.2386 23.3333 15 21.0948 15 18.3333C15 15.5719 17.2386 13.3333 20 13.3333Z"
                fill="#D9D9D9"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.66667 10C6.66667 8.15905 8.15905 6.66667 10 6.66667H30C31.841 6.66667 33.3333 8.15905 33.3333 10V30C33.3333 31.841 31.841 33.3333 30 33.3333H10C8.15905 33.3333 6.66667 31.841 6.66667 30V10ZM10 10H30V30H10V10Z"
                fill="#D9D9D9"
              />
            </svg>
          </div>
        )}
      </div>
      <TextCard imageUrl={imageUrl} title={title} tags={tags} date={date} assignee={assignee} />
    </div>
  );
}
