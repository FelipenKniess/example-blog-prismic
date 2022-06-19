import { GetStaticPaths, GetStaticProps } from 'next';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import { BiTime } from 'react-icons/bi';
import { getPrismicClient } from '../../services/prismic';
import { formatDate } from '../../utils/data';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <main className={styles.container}>
        <img src={post.data.banner.url} alt="Banner post" />
        <div className={styles.content}>
          <h1>{post.data.title}</h1>
          <div className={styles.headerPost}>
            <span>
              <AiOutlineCalendar size={20} />
              {formatDate(post.first_publication_date)}
            </span>
            <span>
              <AiOutlineUser size={20} />
              {post.data.author}
            </span>
            <span>
              <BiTime size={20} /> 4 min
            </span>
          </div>
          <section className={styles.postContent}>
            {post.data.content.map(content => {
              return (
                <>
                  <h2>{content.heading}</h2>
                  {content.body.map(body => {
                    return <p>{body.text}</p>;
                  })}
                </>
              );
            })}
          </section>
        </div>
      </main>
      <span>Carregando...</span>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [
      {
        params: {
          slug: 'como-utilizar-hooks',
        },
      },
      {
        params: {
          slug: 'criando-um-app-cra-do-zero',
        },
      },
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const post: Post = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post,
    },
  };
};
