import styled from "styled-components";

const Menu = styled.div`
  position: fixed;
  bottom: 3rem;
  right: 3rem;
`;

const Button = styled.a`
  border-radius: 1000px;
  width: 64px;
  height: 64px;
  color: #fff;
  background-color: blue;
  font-size: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const FloatingMenu = ({ handleClick, }) => (
  <Menu>
    <Button onClick={handleClick}>+</Button>
  </Menu>
);

export default FloatingMenu;
