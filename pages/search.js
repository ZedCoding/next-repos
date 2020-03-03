import { memo, isValidElement, useEffect } from "react";
import { withRouter } from "next/router";
import Link from "next/link";
import { request } from "../lib/api";
import { Row, Col, List, Pagination } from "antd";
import Repo from "../components/Repo";
import { setCacheArray } from "../lib/repo-basic-cache";

const { Item } = List;

const LANGUAGES = ["JavaScript", "HTML", "CSS", "TypeScript", "Java", "Rust"];
const SORT_TYPES = [
  {
    name: "Best match"
  },
  {
    name: "Most stars",
    value: "stars",
    order: "desc"
  },
  {
    name: "Fewest stars",
    value: "stars",
    order: "asc"
  },
  {
    name: "Most forks",
    value: "forks",
    order: "desc"
  },
  {
    name: "Fewest forks",
    value: "forks",
    order: "asc"
  }
];

/**
 * sort: 排序方式
 * order: 排序顺序
 * lang: 仓库项目的开发语言
 * page: 分页
 */

const selectItemStyle = {
  borderLeft: "2px solid #e36209",
  color: "#999"
};

const per_page = 20;

const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
  let queryString = `?query=${query}`;
  if (lang) queryString += `&lang=${lang}`;
  if (sort) queryString += `&sort=${sort}&order=${order || "desc"}`;
  if (page) queryString += `&page=${page}`;

  queryString += `&per_page=${per_page}`;

  return (
    <Link href={`/search${queryString}`}>
      {isValidElement(name) ? name : <a>{name}</a>}
    </Link>
  );
});

function noop() {}

const isServer = typeof window === "undefined";

function Search({ router, repos }) {
  const { ...querys } = router.query;
  const { lang, sort, order, page } = router.query;

  useEffect(() => {
    if (!isServer) setCacheArray(repos.items);
  });

  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">语言</span>}
            dataSource={LANGUAGES}
            style={{ marginBottom: 20 }}
            renderItem={item => {
              let selected = Boolean(lang === item);
              return (
                <Item style={selected ? selectItemStyle : null}>
                  {selected ? (
                    <span>{item}</span>
                  ) : (
                    <FilterLink {...querys} name={item} lang={item} />
                  )}
                </Item>
              );
            }}
          />
          <List
            bordered
            header={<span className="list-header">排序</span>}
            dataSource={SORT_TYPES}
            renderItem={item => {
              let selected = false;
              if (item.name === "Best match" && !sort) {
                selected = true;
              } else if (item.value === sort && item.order === order) {
                selected = true;
              }
              return (
                <Item style={selected ? selectItemStyle : null}>
                  {selected ? (
                    <span>{item.name}</span>
                  ) : (
                    <FilterLink
                      {...querys}
                      name={item.name}
                      sort={item.value}
                      order={item.order}
                    />
                  )}
                </Item>
              );
            }}
          />
        </Col>
        <Col span={18}>
          <h3 className="repos-title">{repos.total_count} 个仓库</h3>
          {repos.items.map(repo => (
            <Repo key={repo.id} repo={repo} />
          ))}
          <div className="pagination">
            <Pagination
              pageSize={per_page}
              current={Number(page) || 1}
              total={1000}
              onChange={noop}
              itemRender={(page, type, ol) => {
                const p =
                  type === "page"
                    ? page
                    : type === "prev"
                    ? page - 1
                    : page + 1;
                const name = type === "page" ? page : ol;
                return <FilterLink {...querys} page={p} name={name} />;
              }}
            />
          </div>
        </Col>
      </Row>
      <style jsx>{`
        .root {
          padding: 20px 0;
        }
        .list-header {
          font-size: 16px;
          font-weight: 800;
        }
        .repos-title {
          font-size: 24px;
          border-bottom: 1px solid #eee;
          line-height: 50px;
        }
        .pagination {
          padding: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, order, lang, page = 20 } = ctx.query;
  if (!query) {
    return {
      repos: {
        total_count: 0
      }
    };
  }
  let queryString = `?q=${query}`;
  if (lang) queryString += `+language:${lang}`;
  if (sort) queryString += `&sort=${sort}&order=${order}`;
  if (page) queryString += `&page=${page}`;

  queryString += `&per_page=${per_page}`;

  const result = await request(
    {
      url: `/search/repositories${queryString}`
    },
    ctx.req,
    ctx.res
  );
  if (result.status === 200) {
    return {
      repos: result.data
    };
  }
};

export default withRouter(Search);
