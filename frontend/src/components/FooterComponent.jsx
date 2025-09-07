import { Container } from "react-bootstrap";

function FooterComponent() {
  return (
    <footer className="bg-dark text-white py-3 mt-auto">
      <Container className="text-center">
        <small>Powered by <strong>Webknot</strong></small>
      </Container>
    </footer>
  );
}

export default FooterComponent;
