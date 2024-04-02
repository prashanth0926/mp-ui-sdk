import { CircularProgress } from "@mui/material";

export default ({ isLoading, size = '1em' }: { isLoading: boolean, size?: string }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '100%', fontSize: size }}>
      {isLoading && <CircularProgress />}
    </div>
  );
};