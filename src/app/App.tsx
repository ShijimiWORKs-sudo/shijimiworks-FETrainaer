import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import HomePage from '@/features/home/HomePage';
import MorePage from '@/features/home/MorePage';
import DailyPage from '@/features/daily/DailyPage';
import PracticeHubPage from '@/features/subjectA/PracticeHubPage';
import PracticeSessionPage from '@/features/subjectA/PracticeSessionPage';
import MockExamHubPage from '@/features/mockExam/MockExamHubPage';
import MockExamSessionPage from '@/features/mockExam/MockExamSessionPage';
import WeakPage from '@/features/weak/WeakPage';
import ReviewPage from '@/features/review/ReviewPage';
import StatsPage from '@/features/stats/StatsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/practice" element={<PracticeHubPage />} />
        <Route path="/practice/:subject/:category" element={<PracticeSessionPage />} />
        <Route path="/mock-exam" element={<MockExamHubPage />} />
        <Route path="/mock-exam/:subject" element={<MockExamSessionPage />} />
        <Route path="/weak" element={<WeakPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/more" element={<MorePage />} />
      </Route>
    </Routes>
  );
}
