import React from 'react';
import DashboardResume from '@/components/dashboard/candidate/dashboard-resume';
import { currentUser } from '@clerk/nextjs';
import { getUserById, getUserByMongoId } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import { getResumeById } from '@/lib/actions/candidate.action';

const CandidateDashboardResumePage = async () => {
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in');
  }
  const loggedInUser = await getUserById({ userId: user?.id });
  if (loggedInUser.role !== 'candidate') {
    return redirect('/');
  }
  const mongoUser = await getUserByMongoId({ id: loggedInUser._id });
  let currentResume = null;
  if (mongoUser?.resumeId) {
    currentResume = await getResumeById(mongoUser?.resumeId);
  } else {
    redirect(`/dashboard/candidate-dashboard/resume/new/${mongoUser._id}`);
  }

  return (
    <>
      {/* Resume area start */}
      <DashboardResume resume={currentResume} mongoUser={mongoUser} />
      {/* Resume area end */}
    </>
  );
};

export default CandidateDashboardResumePage;
