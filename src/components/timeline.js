import { useContext, useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { LoggedInUserContext } from "../context";
import { usePhotos } from "../hooks";
import { getAllPosts } from "../services";
import { Post } from "./post";

export function Timeline() {
  const { user } = useContext(LoggedInUserContext);

  const tabs = ["todos", "tendencia", "global"];
  const [selectedTab, setSelectedTab] = useState(() => tabs[0]);
  const { user: { following } = {} } = useContext(LoggedInUserContext);
  const [displayedPhotos, setDisplayedPhotos] = useState([]);

  const { photos } = usePhotos(user);

  useEffect(() => {
    async function fetchTimeline() {
      if (selectedTab === "todos") {
        setDisplayedPhotos(photos);
      } else if (selectedTab === "tendencia") {
        const auxPhotosArray = new Array(...photos);

        const sortedTendencyPhotos = new Array(
          ...auxPhotosArray.sort((a, b) => {
            return b.likes.length - a.likes.length;
          })
        );

        setDisplayedPhotos(sortedTendencyPhotos);
      } else if (selectedTab === "global") {
        const allPhotos = await getAllPosts(user.userId);
        const sortedGlobalPhotos = new Array(
          ...allPhotos.sort((a, b) => {
            return b.likes.length - a.likes.length;
          })
        );
        setDisplayedPhotos(sortedGlobalPhotos);
      }
    }
    if (photos != null) {
      fetchTimeline();
    }
  }, [selectedTab, photos]);

  return (
    <div className="col-span-2">
      <div className="flex flex-row justify-between mb-4 ">
        {tabs.map((tab) => {
          const selected = tab === selectedTab;

          return (
            <p
              key={tab}
              className={`capitalize cursor-pointer ${selected && "font-bold"}`}
              onClick={() => {
                setSelectedTab(tab);
              }}
            >
              {tab}
            </p>
          );
        })}
      </div>
      {displayedPhotos != null &&
        photos != null &&
        displayedPhotos.map((content) => (
          <Post key={content.docId} content={content} />
        ))}
      {/* {following === undefined ? (
        <Skeleton count={2} width={640} height={500} className="mb-5" />
      ) : following.length === 0 ? (
        <p className="flex justify-center font-bold">
          Follow other people to see Photos
        </p>
      ) : photos ? (
        photos.map((content) => <Post key={content.docId} content={content} />)
      ) : null} */}
    </div>
  );
}
