import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiPlus } from 'react-icons/fi';

const MergeTagSelector = ({ contactHeaders, setBody }) => {
  const [activeMergeTag, setActiveMergeTag] = useState('');
  
  const defaultTags = [
    { tag: '{name}', icon: <FiUser className="mr-1" /> },
    { tag: '{email}', icon: <FiMail className="mr-1" /> },
    { tag: '{phone}', icon: <FiPhone className="mr-1" /> }
  ];

  const insertMergeTag = (tag) => {
    const textarea = document.getElementById('email-body');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    
    setBody(
      body => body.substring(0, startPos) + tag + body.substring(endPos)
    );
    
    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + tag.length, startPos + tag.length);
    }, 0);
  };

  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600 mb-2">Merge Tags: Click to insert</p>
      <div className="flex flex-wrap gap-2">
        {defaultTags.map((tag, index) => (
          <button
            key={index}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
            onClick={() => insertMergeTag(tag.tag)}
          >
            {tag.icon}
            {tag.tag}
          </button>
        ))}
        
        {contactHeaders.map((header, index) => (
          <button
            key={`header-${index}`}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm"
            onClick={() => insertMergeTag(`{${header}}`)}
          >
            {`{${header}}`}
          </button>
        ))}
        
        <div className="relative">
          <input
            type="text"
            className="border rounded-full px-3 py-1 pr-8 text-sm w-32"
            placeholder="New tag"
            value={activeMergeTag}
            onChange={(e) => setActiveMergeTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && activeMergeTag) {
                if (!activeMergeTag.startsWith('{') || !activeMergeTag.endsWith('}')) {
                  setActiveMergeTag(`{${activeMergeTag.replace(/[{}]/g, '')}}`);
                } else {
                  insertMergeTag(activeMergeTag);
                  setActiveMergeTag('');
                }
              }
            }}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => {
              if (activeMergeTag) {
                if (!activeMergeTag.startsWith('{') || !activeMergeTag.endsWith('}')) {
                  setActiveMergeTag(`{${activeMergeTag.replace(/[{}]/g, '')}}`);
                } else {
                  insertMergeTag(activeMergeTag);
                  setActiveMergeTag('');
                }
              }
            }}
          >
            <FiPlus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MergeTagSelector;