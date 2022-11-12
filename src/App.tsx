import React, { useEffect, useState, useRef } from "react";
import "./App.css";

interface Post {
  userId: string;
  id: number;
  title: string;
  body: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currPosts, setCurrPosts] = useState<Post[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((res) => {
        setPosts(res);
        const newArr: Post[] = res.reduce((a: Post[], b: Post) => {
          if (b.id <= 15) {
            a.push(b);
          }
          return a;
        }, []);
        setCurrPosts(newArr);
      })
      .catch(console.log);
  }, []);

  const grabNextItem = () => {
    const lastItem: number = currPosts[currPosts.length - 1]?.id;
    const findNextItem: Post | undefined = posts.find((i) => i?.id === lastItem + 1);
    if (findNextItem) {
      setCurrPosts((pre: Post[]) => [...pre, findNextItem]);
    }
  };

  useEffect(() => {
    const target = contentRef.current as HTMLElement;
    const rootTarget = rootRef.current as HTMLElement;
    if (!!currPosts.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            grabNextItem();
            observer.unobserve(target);
          }
        },
        {
          threshold: 1,
          rootMargin: '100px'
        }
      );
      observer.observe(target);
    }
  }, [currPosts.length]);

  return (
    <div ref={rootRef} id='myItems' className='text-lg overflow-hidden font-bold'>
      {currPosts.map((post: Post, index: number) => {
        if (currPosts.length === index + 1) {
          return (
            <div ref={contentRef} className={`text-lg p-4`} key={post?.id}>
              {post?.title}
            </div>
          );
        }
        return (
          <div className={`text-lg p-4`} key={post?.id}>
            {post?.title}
          </div>
        );
      })}
    </div>
  );
}

export default App;
