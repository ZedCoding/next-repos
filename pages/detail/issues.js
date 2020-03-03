import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import withRepoBasic from "../../components/with-repo-basic";
import { request } from "../../lib/api";
import { Avatar, Button, Select, Spin } from "antd";
import { getLastUpdated } from "../../lib/utils";

const MarkdownRenderer = dynamic(import("../../components/MarkdownRenderer"));
const SearchUser = dynamic(import("../../components/SearchUser"));

const CACHE = {};

function IssueDetail({ issue }) {
  return (
    <div className="root">
      <MarkdownRenderer content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">
          打开Issue讨论页面
        </Button>
      </div>
      <style jsx>{`
        .root {
          padding: 20px;
          background-color: #fefefe;
        }
        .actions {
          text-align: right;
        }
      `}</style>
    </div>
  );
}

function IssueItem({ issue }) {
  const [showDetail, setShowDetail] = useState(false);
  const toggleShowDetail = useCallback(() => {
    setShowDetail(detail => !detail);
  }, [showDetail]);
  return (
    <div className="root">
      <div className="issue">
        <Button
          type="primary"
          size="small"
          style={{ position: "absolute", top: 10, right: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? "隐藏" : "查看"}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            {
              issue.labels.map(label => <Label key={label.id} label={label} />)
            }
          </h6>
          <p className="sub-info">
            <span>Updated at {getLastUpdated(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>{`
          .issue {
            display: flex;
            padding: 10px;
            position: relative;
          }
          .issue:hover {
            background-color: #fafafa;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .avatar {
            margin-right: 20px;
          }
          .main-info {
            padding-right: 50px;
          }
          .main-info > h6 {
            max-width: 600px;
            font-size: 16px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}</style>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
    </div>
  );
}

function makeQuery(creator, state, labels) {
  let creatorStr = creator ? `creator=${creator}` : "";
  let stateStr = state ? `state=${state}` : "";
  let labelStr = "";
  if (labels && labels.length > 0) {
    labelStr = `labels=${labels.join(",")}`;
  }
  const arr = [];
  if (creatorStr) arr.push(creatorStr);
  if (stateStr) arr.push(stateStr);
  if (labelStr) arr.push(labelStr);
  return `?${arr.join("&")}`;
}

function Label({ label }) {
  return (
    <>
      <span className="label" style={{ backgroundColor: `#${label.color}` }}>
        {label.name}
      </span>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding: 3px 10px;
          border-radius: 3px;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}

const { Option } = Select;
const isServer = typeof window === 'undefined';
function Issues({ initialIssues, labels, owner, name }) {
  const [creator, setCreator] = useState();
  const [state, setState] = useState();
  const [label, setLabel] = useState();
  const [issues, setIssues] = useState(initialIssues);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isServer) {
      CACHE[`${owner}/${name}`] = labels;
    }
  }, [owner, name, labels])


  const handleCreatorChange = useCallback(value => {
    setCreator(value);
  }, []);

  const handleStateChange = useCallback(value => {
    setState(value);
  }, []);

  const handleLabelChange = useCallback(value => {
    setLabel(value);
  }, []);

  const handleSearch = useCallback(async () => {
    setFetching(true);
    const res = await request({
      url: `/repos/${owner}/${name}/issues${makeQuery(creator, state, label)}`
    });
    setIssues(res.data);
    setFetching(false);
  }, [owner, name, creator, state, label]);

  return (
    <div className="root">
      <div className="search">
        <SearchUser onChange={handleCreatorChange} value={creator} />
        <Select
          onChange={handleStateChange}
          value={state}
          placeholder="状态"
          style={{ width: 200, marginLeft: 20 }}
        >
          <Option value="all">all</Option>
          <Option value="open">open</Option>
          <Option value="closed">closed</Option>
        </Select>
        <Select
          mode="multiple"
          onChange={handleLabelChange}
          value={label}
          placeholder="Label"
          style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}
        >
          {labels.map(la => (
            <Option key={la.id} value={la.name}>
              {la.name}
            </Option>
          ))}
        </Select>
        <Button type="primary" disabled={fetching} onClick={handleSearch}>
          搜索
        </Button>
      </div>
      {fetching ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
          <div className="issues">
            {issues.map(issue => (
              <IssueItem key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      <style jsx>{`
        .search {
          display: flex;
        }
        .issues {
          margin: 20px 0;
          border: 1px solid #eee;
          border-radius: 5px;
        }
        .loading {
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
Issues.getInitialProps = async ({
  ctx: {
    query: { owner, name }
  },
  req,
  res
}) => {
  const full_name = `${owner}/${name}`;
  const fetchs = await Promise.all([
    await request(
      {
        url: `/repos/${owner}/${name}/issues`
      },
      req,
      res
    ),
    CACHE[full_name] ? Promise.resolve({ data: CACHE[full_name] }) : await request(
      {
        url: `/repos/${owner}/${name}/labels`
      },
      req,
      res
    )
  ]);

  return {
    owner,
    name,
    initialIssues: fetchs[0].data,
    labels: fetchs[1].data
  };
};

export default withRepoBasic(Issues, "issues");
