import Link from "next/link";
import { Icon } from "antd";
import { getLastUpdated } from "../lib/utils";

function getLicense(license) {
  return license ? `${license.spdx_id} license` : "";
}

export default ({ repo }) => {
  return (
    <div className="root">
      <div className="basic-info">
        <h3 className="repo-title">
          <Link href={`/detail?owner=${repo.owner.login}&name=${repo.name}`}>
            <a>{repo.full_name}</a>
          </Link>
        </h3>
        <p className="repo-desc">{repo.description}</p>
        <div className="other-info">
          {repo.license ? (
            <span className="license">{getLicense(repo.license)}</span>
          ) : null}
          <span className="last-updated" style={{ marginLeft: 10 }}>
            {getLastUpdated(repo.updated_at)}
          </span>
          <span className="open-issues" style={{ marginLeft: 10 }}>
            {repo.open_issues_count} open issues
          </span>
        </div>
      </div>
      <div className="lang-star">
        <span className="lang">{repo.language}</span>
        <span className="stars">
          {repo.stargazers_count} <Icon type="star" theme="filled" />
        </span>
      </div>
      <style jsx>{`
        .root {
          display: flex;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .repo-title {
          font-size: 20px;
        }
        .repo-desc {
          width: 400px;
        }
        .lang-star {
          display: flex;
        }
        .lang-star > span {
          width: 120px;
          text-align: right;
        }
      `}</style>
    </div>
  );
};
