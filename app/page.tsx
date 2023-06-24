'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
export default function Home() {
  interface JobListing {
    company: string;
    company_logo: string;
    keywords: string[];
    location: string;
    position: string;
    posted_on: number;
    timing: string;
  }
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<JobListing[]>([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const filterParam = queryParams.get('filterby');
    if (filterParam) {
      const filters = filterParam.split(',');
      setActiveFilters(filters);
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (activeFilters.length) {
      queryParams.set('filterby', activeFilters.join(','));
      router.replace(`/?${queryParams.toString()}`);
    } else {
      router.replace('/');
    }
  }, [activeFilters]);

  // fetching data using swr
  const { data }: any = useSWR(
    'https://storage.googleapis.com/programiz-static/hiring/software/job-listing-page-challenge/data.json',
    async (url) => await axios(url)
  );

  // converting milisec into days
  const dateConverter = (posted_on: any) => {
    console.log(posted_on);
    const targetTimeInMs = posted_on;
    const currentTime = new Date();

    const timeDiffInMilliseconds = currentTime.getTime() - targetTimeInMs;
    const timeDiffInDays = Math.floor(
      timeDiffInMilliseconds / (1000 * 60 * 60 * 24)
    );

    return timeDiffInDays;
  };

  // handling addition and deletion of keywords
  const handleKeywordFilter = (keyword: string) => {
    if (activeFilters.includes(keyword)) {
      const updatedFilters = activeFilters.filter(
        (filter) => filter !== keyword
      );
      setActiveFilters(updatedFilters);
    } else {
      const updatedFilters = [...activeFilters, keyword];
      setActiveFilters(updatedFilters);
    }
  };
  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  // filter out the data according on change in active filters
  useEffect(() => {
    if (data && activeFilters.length > 0) {
      const filteredJobs = data?.data?.filter((info: JobListing) => {
        return activeFilters.every((filter) => info.keywords.includes(filter));
      });
      setFilteredData(filteredJobs);
    } else {
      setFilteredData([]);
    }
  }, [data, activeFilters]);
  return (
    <main className=" bg-background/60 min-h-screen">
      <Image
        className="h-[140px] w-screen object-cover "
        src={'/images/background.jpg'}
        width={900}
        height={900}
        alt="background"
      />

      {/* filter section div */}
      <div className="flex flex-col items-center w-full pt-16 relative">
        <div
          className={`${
            activeFilters.length > 0 ? 'flex' : 'hidden'
          } px-8 absolute justify-between -top-[40px] bg-white rounded-md inset-x-0 mx-auto w-[80%] py-5`}
        >
          <div className="flex gap-2 ">
            {activeFilters.map((filter, i) => (
              <div
                className="flex items-center  rounded-md overflow-hidden group "
                key={i}
              >
                <div className="py-1 px-2 bg-gray-100 text-black/50 group-hover:text-black/60 text-base font-[500]">
                  {filter}
                </div>
                <span
                  className=" cursor-pointer group-hover:bg-gray-600 bg-gray-400 py-1 px-2.5 text-white"
                  onClick={() => handleKeywordFilter(filter)}
                >
                  &#10005;
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleClearFilters}
            className="hover:underline text-gray-500 font-[500] text-sm"
          >
            Clear
          </button>
        </div>

        {/* job listing section */}

        <div className="w-[80%] flex flex-col gap-5  ">
          {activeFilters.length > 0 && filteredData.length == 0 ? (
            <div className="flex items-center justify-center">
              Sorry ! There's not any job with such keyword
            </div>
          ) : (
            (filteredData.length > 0 ? filteredData : data?.data || []).map(
              (info: JobListing, i: number) => (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    duration: 0.3,
                    delay: i * 0.2,
                  }}
                  exit={{ opacity: 0 }}
                  className="justify-between flex bg-white rounded-md  hover:shadow-xl transition-all ease-linear dura  gap-2 py-5 px-8 hover:border-l-[4px] hover:border-blue-400 items-center shadow-md"
                  key={i}
                >
                  <div className="flex  items-center gap-6 ">
                    <div className="h-[50px] w-[50px] rounded-full overflow-hidden relative ring-[1px] ring-black/20 ">
                      <Image
                        className="absolute object-contain object-center w-full h-full scale-125 "
                        src={info.company_logo}
                        width={600}
                        height={600}
                        alt="logo"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-base text-black/50 font-semibold">
                        {info.company}
                      </div>

                      <div className="font-bold text-lg hover:text-black/50 cursor-pointer">
                        {info.position}
                      </div>
                      <div className="text-black/50 flex items-center gap-2 text-sm font-[500]">
                        <div>{info.timing}</div>
                        <span>·</span>
                        <div>{dateConverter(info.posted_on)}d ago</div>
                        <span>·</span>
                        <div>{info.location}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {info.keywords?.map((key, j) => (
                      <div
                        onClick={() => {
                          if (!activeFilters.includes(key)) {
                            handleKeywordFilter(key);
                          }
                        }}
                        key={j}
                        className="cursor-pointer bg-gray-200 py-1 px-2 font-semibold text-sm hover:bg-gray-400 hover:text-white rounded-[0.2rem] text-black/50"
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            )
          )}
        </div>
      </div>
    </main>
  );
}
