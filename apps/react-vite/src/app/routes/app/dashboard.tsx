import { useEffect, useState } from 'react';

import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/lib/auth';
import { ROLES } from '@/lib/authorization';
import { getUser, getToken } from '@/lib/oauth2';
import { OAuthUser } from '@/types/api';

function DashboardRoute() {

  const token = getToken();
  const [data, setData] = useState<OAuthUser>();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser(token);
      setData(user);
    }

  fetchData();
  }, [token]
);


  
  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl">
      Welcome <b>{`${data?.name}`}</b>
      </h1>
      <ul className="my-4 list-inside list-disc">
        <li>Create discussions</li>
        <li>Edit discussions</li>
        <li>Delete discussions</li>
        <li>Comment on discussions</li>
        <li>Delete all comments</li>
      </ul>
    </ContentLayout>
    )
};

export default DashboardRoute;
