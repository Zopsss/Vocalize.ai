import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

interface Props {
  attemptId: string;
}

export const AttemptsIdView = ({ attemptId }: Props) => {
  return <div>AttemptsIdView {attemptId}</div>;
};

export const AttemptsIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Interview Attempt"
      description="This may take some time"
    />
  );
};

export const AttemptsIdViewError = () => {
  return (
    <ErrorState
      title="Error while loading the Interview Attempt"
      description="Something went wrong"
    />
  );
};
