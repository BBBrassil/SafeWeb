import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'
import spinner from "/spinner.svg";

const supabaseUrl = "https://bjskorjayxkvdqckmtfk.supabase.co";
const supabaseKey = "sb_publishable_LT3tQwhwKe0d7oMW1nxe0g_QFehI131";
const supabase = createClient(supabaseUrl, supabaseKey);

const timeoutMilliseconds: number = 60000;

interface ReportState {
  target: string,
  isSending: boolean,
  response?: unknown,
  error?: unknown
}

const state: ReportState = {
  target: "",
  isSending: false,
  response: undefined,
  error: undefined
};

const waitForMilliseconds = (ms: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timed out")), ms);
  });
}

const getActiveTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const sendReport = async (target: string) => {
  const body = { target: target };
  return Promise.race([
    waitForMilliseconds(timeoutMilliseconds),
    supabase.functions.invoke("report", { body: body })
  ]);
}

function Report() {
  const [target, setTarget] = useState(state.target);
  const [isSending, setIsSending] = useState(state.isSending);
  const [response, setResponse] = useState(state.response);
  const [error, setError] = useState(state.error);
  const handleReport = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsSending(true);
  };
  const handleClose = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    window.close();
  }
  useEffect(() => {
    getActiveTab()
      .then((activeTab) => {
        const url: URL = new URL(activeTab.url ?? "");
        setTarget(url.searchParams.get("target") ?? "");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [target]);
  useEffect(() => {
    if (!isSending) {
      return;
    }
    setResponse(undefined);
    setError(undefined);
    sendReport(target)
      .then((response) => {
        setIsSending(false);
        setResponse(response);
      })
      .catch((error) => {
        setIsSending(false);
        setError(error);
        console.log(error);
      });
  }, [target, isSending]);
  if (error !== undefined) {
    return (
      <div className="Report">
        <h1>Error</h1>
        <p>Sorry, SafeWeb failed to report this URL as malicious.</p>
        <p><b>{target}</b></p>
        <button onClick={handleReport}>Retry</button>
        <button onClick={handleClose}>Cancel</button>
      </div>
    );
  }
  else if (response !== undefined) {
    return (
      <div className="Report">
        <h1>Report Submitted</h1>
        <p>SafeWeb reported this URL as malicious.</p>
        <p><b>{target}</b></p>
        <button onClick={handleClose}>Cancel</button>
      </div>
    );
  }
  else if (isSending) {
    return (
      <div className="Report">
        <img src={spinner} alt="Sending report..." width="400" height="400" />
      </div>
    );
  }
  else if (target !== "") {
    return (
      <div className="Report">
        <h1>Report</h1>
        <p>Are you sure you want to report this URL as malicious?</p>
        <p><b>{target}</b></p>
        <button onClick={handleReport}>Report</button>
        <button onClick={handleClose}>Cancel</button>
      </div>
    );
  }
  else {
    return (
      <div className="Report">
        <h1>Report</h1>
        <p>Nothing to report.</p>
        <button onClick={handleClose}>Cancel</button>
      </div>
    );
  }
}

export default Report;