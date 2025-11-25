import Card from '@/components/card/Card';
import Column from '@/components/column/Column';

export default function CardTestPage() {
  return (
    <div>
      <Card imageUrl={null} title="Test Cssard" tags={['tag1', 'tag2', 'tag3']} date="2021-01-01" />
      <Card
        imageUrl="/images/card/card_image2.svg"
        title="Test Card"
        tags={['tag1', 'tag2', 'tag3']}
        date="2021-01-01"
      />
      <Column title={'To Do'} cardCount={10}>
        <Card imageUrl={null} title="Test Card" tags={['tag1', 'tag2', 'tag3']} date="2021-01-01" />
        <Card
          imageUrl="/images/card/card_image2.svg"
          title="Test Card"
          tags={['tag1', 'tag2', 'tag3']}
          date="2021-01-01"
        />
      </Column>
    </div>
  );
}
