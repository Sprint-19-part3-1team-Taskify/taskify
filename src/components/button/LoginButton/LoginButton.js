import BaseButton from '../BaseButton/BaseButton';

export default function LoginButton({
  size = 'large',
  active = true,
  children = '로그인',
  ...props
}) {
  return (
    <BaseButton size={size} state={active ? 'active' : 'inactive'} {...props}>
      {children}
    </BaseButton>
  );
}
