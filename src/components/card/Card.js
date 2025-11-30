import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useMemo } from 'react';
import styles from './Card.module.scss';
import TextCard from './TextCard';

export default function Card({ cardId, imageUrl, title, tags, date, assignee, onClick }) {
  const [imgError, setImgError] = useState(false);

  // URL 가공 없이 바로 프록시로 넘김 (인코딩 X)
  const normalizedUrl = useMemo(() => {
    if (!imageUrl) return null;

    // 완전한 URL만 허용 (S3가 반드시 https)
    if (!imageUrl.startsWith('http')) return null;

    return `/api/image-proxy?url=${imageUrl}`;
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

  const handleClick = (e) => {
    if (!isDragging && onClick) {
      onClick(e);
    }
  };

  // 이미지 URL이 없으면 텍스트 카드만 표시
  if (!normalizedUrl) {
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={handleClick}>
        <TextCard title={title} tags={tags} date={date} assignee={assignee} />
      </div>
    );
  }

  // 이미지 URL이 있으면 이미지 영역 포함 (로딩 실패 시 회색 배경 유지)
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={styles.imageCard}
      onClick={handleClick}
    >
      <div className={styles.imageWrapper}>
        {!imgError && (
          <img
            src={normalizedUrl}
            alt={title}
            className={styles.image}
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <TextCard imageUrl={imageUrl} title={title} tags={tags} date={date} assignee={assignee} />
    </div>
  );
}
