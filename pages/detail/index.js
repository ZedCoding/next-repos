import withRepoBasic from "../../components/with-repo-basic";
import { request } from "../../lib/api";
import dynamic from "next/dynamic";
const MarkdownRenderer = dynamic(() =>
  import("../../components/MarkdownRenderer")
);

function Detail({ readme }) {
  return <MarkdownRenderer content={readme.content} isBase64={true} />;
}
Detail.getInitialProps = async ({
  ctx: {
    query: { owner, name }
  },
  req,
  res
}) => {
  const result = await request(
    {
      url: `/repos/${owner}/${name}/readme`
    },
    req,
    res
  );
  return {
    readme: result.data
  };
};

export default withRepoBasic(Detail, "index");
