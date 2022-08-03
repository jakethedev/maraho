import fs from "fs";
import Head from "next/head";
import path from "path";
import Layout from "../../components/main.layout";
import config from "../../config";
import Markdown from "../../components/markdown.component";
import MetaTags from "../../components/meta.component";

export default function article({ article, markdown, data }) {
	const getDescription = () => {
		if (data.description !== undefined && data.description !== "")
			return data.description;
		if (markdown !== undefined && markdown !== "")
			return markdown.substring(0, 125) + "...";
		return config.meta.description;
	};

	return (
		<>
			<Layout>
				<Head>
					<title>{`${data.title} - ${config.name}`}</title>
					<MetaTags
						title={`${data.title} - ${config.name}`}
						url={`${config.url}/`}
						description={`${getDescription()}`}
						name={`${data.title} - ${config.name}`}
					/>
				</Head>
				<main>
					<div className="container mx-auto py-10 md:px-20 px-5">
						<Markdown markdown={markdown} />
					</div>
				</main>
			</Layout>
		</>
	);
}

export async function getStaticPaths() {
	const pathCategory = path.join(process.cwd(), "content");
	const categories = fs
		.readdirSync(pathCategory)
		.filter((path) => !path.includes("index.md"));

	let paths = [];
	categories.map((category) => {
		const articles = fs
			.readdirSync(path.join(pathCategory, category))
			.filter((path) => !path.includes("category.json"));
		articles.map((article) => {
			paths.push({
				params: {
					article,
					category,
				},
			});
		});
	});

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	const article = fs.readFileSync(
		path.join(
			process.cwd(),
			"content",
			params.category,
			params.article,
			"article.json"
		)
	);

	const markdown = fs.readFileSync(
		path.join(
			process.cwd(),
			"content",
			params.category,
			params.article,
			"index.md"
		)
	);

	let data = await JSON.parse(article);

	return {
		props: {
			id: params.category,
			article: params.article,
			data,
			markdown: markdown.toString(),
		},
	};
}
