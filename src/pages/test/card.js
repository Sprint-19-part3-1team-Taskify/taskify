import TextCard from '@/components/card/TextCard';
import ImageCard from '@/components/card/ImageCard';
import Column from '@/components/column/Column';

export default function CardTestPage() {
  return (
    <div>
      <TextCard title="Test Card" tags={['tag1', 'tag2', 'tag3']} date="2021-01-01" />
      <ImageCard
        imageUrl="/images/card/card_image2.svg"
        title="Test Card"
        tags={['tag1', 'tag2', 'tag3']}
        date="2021-01-01"
      />
      <Column>
        <TextCard title="Test Card" tags={['tag1', 'tag2', 'tag3']} date="2021-01-01" />
        <ImageCard
          imageUrl="/images/card/card_image2.svg"
          title="Test Card"
          tags={['tag1', 'tag2', 'tag3']}
          date="2021-01-01"
        />
      </Column>
    </div>
  );
}
