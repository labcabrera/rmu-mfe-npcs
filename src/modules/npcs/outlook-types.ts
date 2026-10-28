import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { fetchEnumerations, useNotify } from '@labcabrera-rmu/rmu-react-shared-lib';

/** Keys of the NPC outlooks (`outlook-type` enumeration), shown as `outlook-<key>`; undefined while they load. */
export const useOutlookTypes = (): string[] | undefined => {
  const auth = useAuth();
  const notify = useNotify();
  const [outlookTypes, setOutlookTypes] = useState<string[]>();

  useEffect(() => {
    fetchEnumerations('category==outlook-type', 0, 100, auth)
      .then((response) => setOutlookTypes(response.content.map((e) => e.key)))
      .catch((err) => notify.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return outlookTypes;
};
