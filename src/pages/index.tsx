/* eslint func-names: ["error", "never"] */
/* eslint no-param-reassign: "off" */

import { GetStaticProps } from 'next';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import Prismic from '@prismicio/client';
import Link from 'next/link';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';
import { formatDate } from '../utils/data';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handleClickLoadPosts = (linkPagination: string): void => {
    fetch(linkPagination)
      .then(function (response) {
        return response.json();
      })
      .then(function (dados: PostPagination) {
        setNextPage(dados.next_page);
        setPosts([...posts, ...dados.results]);
      });
  };

  return (
    <main className={styles.container}>
      <div className={styles.posts}>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <div className={styles.post}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div className={styles.footer}>
                <span>
                  <AiOutlineCalendar size={20} />
                  {formatDate(post.first_publication_date)}
                </span>
                <span>
                  <AiOutlineUser size={20} />
                  {post.data.author}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {nextPage && (
          <button
            className={styles.buttonLoadPosts}
            type="button"
            onClick={() => handleClickLoadPosts(nextPage)}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsPagination = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['publication.title', 'publication.content'],
    }
  );

  return {
    props: {
      postsPagination,
    },
  };
};
