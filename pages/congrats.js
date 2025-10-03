import { useUser } from '@/lib/useAuth';
export default function Congrats(){
  useUser(false);
  return (
    <div className="wrap">
      <div className="card">
        <h1>🎉 Congratulations! 🎉</h1>
        <p>You’ve completed all four puzzles and unlocked the final answer.</p>
        <p>Only the sharpest minds make it this far — well done!</p>
      </div>
    </div>
  );
}
