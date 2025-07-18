import Row from "@components/Row";
import Empty from "@components/Empty";
import Spinner from "@components/Spinner";
import WorkflowInstanceCard from "./WorkflowInstanceCard";
import styled from "styled-components";

const Container = styled.div`
  margin: 20px 0;
`;

/**
 * List component for displaying workflow instances
 * Handles loading states and empty states
 */
function WorkflowInstanceList({ isPending = false, instancesData = [] }) {
  if (isPending) {
    return <Spinner />;
  }

  if (!instancesData.length) {
    return <Empty resource="workflow instances" />;
  }

  return (
    <Container>
      <Row type="vertical">
        {instancesData.map((instance) => (
          <WorkflowInstanceCard key={instance.id} instance={instance} />
        ))}
      </Row>
    </Container>
  );
}

export default WorkflowInstanceList;
