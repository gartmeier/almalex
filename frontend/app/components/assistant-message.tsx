import Markdown from "react-markdown";
import { useState } from "react";
import { Search, ChevronDown, FileText } from "lucide-react";
import type { MessageDetail, SearchContentBlock, TextContentBlock } from "~/lib/api";

type AssistantMessageProps = {
  message: MessageDetail;
};

function SearchBlock({ block, index }: { block: SearchContentBlock; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div key={index} className="transition-all duration-400 ease-out rounded-lg border flex flex-col font-ui tracking-tight leading-normal my-4 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 min-h-[2.625rem] hover:bg-gray-100 dark:hover:bg-gray-800/50 shadow-sm">
      <button 
        className="group/row flex flex-row items-center justify-between gap-4 transition-colors duration-200 rounded-lg text-text-300 hover:text-text-200 h-[2.625rem] py-2 px-3 cursor-pointer hover:text-text-000"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-row items-center gap-2 min-w-0">
          <div className="w-5 h-5 flex items-center justify-center text-text-100">
            <Search size={16} />
          </div>
          <div className="relative bottom-[0.5px] font-base text-left leading-tight overflow-hidden overflow-ellipsis whitespace-nowrap flex-grow text-text-300">
            {block.query}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1.5 min-w-0 shrink-0">
          <p className="relative bottom-[0.5px] pl-1 text-text-500 font-small leading-tight shrink-0 whitespace-nowrap">
            {block.results.length} {block.results.length === 1 ? 'result' : 'results'}
          </p>
          <div 
            className={`flex items-center justify-center relative bottom-[0.5px] transform transition-transform duration-400 ease-snappy-out text-text-300 ${isExpanded ? '-rotate-180' : 'rotate-0'}`}
            style={{ width: '16px', height: '16px' }}
          >
            <ChevronDown size={16} />
          </div>
        </div>
      </button>
      
      <div 
        className="overflow-hidden shrink-0"
        style={{ 
          opacity: isExpanded ? 1 : 0, 
          height: isExpanded ? 'auto' : '0px' 
        }}
      >
        <div className="min-h-0">
          <div className="overflow-y-auto overflow-x-hidden min-h-0 h-full max-h-[238px]">
            <div className="flex flex-nowrap p-2 pt-0 flex-col">
              {block.results.map((result) => (
                <div key={result.id}>
                  <a target="_blank" href={result.url} rel="noopener noreferrer">
                    <button className="flex flex-row gap-4 items-center justify-between rounded-md tracking-tight shrink-0 h-[2rem] px-1 w-full min-w-0 cursor-pointer hover:bg-bg-100">
                      <div className="flex flex-row items-center gap-2 min-w-0">
                        <div className="h-5 w-5 flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-text-400" />
                        </div>
                        <p className="relative bottom-[1px] text-[0.875rem] whitespace-nowrap overflow-hidden text-ellipsis shrink text-text-000">
                          {result.title}
                        </p>
                        <p className="relative bottom-[1px] text-[0.75rem] text-text-500 line-clamp-1 shrink-0">
                          Document
                        </p>
                      </div>
                    </button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderContentBlock(block: SearchContentBlock | TextContentBlock, index: number) {
  if (block.type === "text") {
    return (
      <div key={index} className="prose prose-neutral dark:prose-invert inline-block max-w-none">
        <Markdown>{block.text}</Markdown>
      </div>
    );
  }
  
  if (block.type === "search") {
    return <SearchBlock key={index} block={block} index={index} />;
  }
  
  return null;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  return (
    <div className="py-5">
      {message.content_blocks?.map((block, index) => renderContentBlock(block, index))}
    </div>
  );
}