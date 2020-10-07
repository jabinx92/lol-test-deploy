import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GiBroadsword,GiCheckedShield, GiOverlordHelm } from 'react-icons/gi'
import Octicon, { TriangleDown } from "@githubprimer/octicons-react";
import FlipMove from 'react-flip-move';
import  langColors  from '../utils/langColors';
import ReposStyles from './styles/ReposStyles';
import DropdownStyles from './styles/DropdownStyles';
import  Section  from '../style/Section';
import {useCallback} from 'react'

const Repos = ({ repoData }) => {
  const [topRepos, setTopRepos] = useState([]);
  const [sortType, setSortType] = useState('attack');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getTopRepos = useCallback((type) => {
    const LIMIT = 8;
    const map = {
      attack: 'attack',
      defense: 'defense',
      difficulty: 'difficulty',
    };
    const sortProperty = map[type];
    const sorted = repoData
      .filter(repo => !repo.fork)
      .sort((a, b) => b[sortProperty] - a[sortProperty])
      .slice(0, LIMIT);
    setTopRepos(sorted);
  }, [repoData]);

  useEffect(() => {
    if (repoData.length) {
      getTopRepos();
    }
  }, [repoData.length, getTopRepos]);

  useEffect(() => getTopRepos(sortType), [sortType, getTopRepos]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const changeRepoSort = sortType => {
    setSortType(sortType);
    toggleDropdown();
  };

  const sortTypes = ['attack', 'defense', 'difficulty'];

  return (
    <Section>
      <ReposStyles>
        <header>
          <h2>Top Champions</h2>
          <div className="dropdown-wrapper">
            <span className="label">by</span>
            <DropdownStyles active={dropdownOpen}>
              <button className="dropdown__button" onClick={() => toggleDropdown()}>
                <label>{sortType}</label>
                <Octicon icon={TriangleDown} />
              </button>
              <ul className="dropdown__list">
                {sortTypes.map((type, i) => (
                  <li className="dropdown__list-item" key={i}>
                    <button onClick={() => changeRepoSort(type)}>{type}</button>
                  </li>
                ))}
              </ul>
            </DropdownStyles>
          </div>
        </header>

        <div className="repo-list">
          {topRepos.length > 0 ? (
            <FlipMove typeName="ul">
              {topRepos.map(repo => (
                <li key={repo.id}>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="repo">
                    <div className="repo__top">
                      <div className="repo__name">
                        <GiOverlordHelm />
                        <h3>{repo.name}</h3>
                      </div>
                      <p>{repo.description}</p>
                    </div>
                    <div className="repo__stats">
                      <div className="repo__stats--left">
                        <span>
                          <div
                            className="language"
                            style={{ backgroundColor: langColors[repo.language] }}
                          />
                          {repo.language}
                        </span>
                        <span>
                          <GiBroadsword title="Damage"/>
                          {repo.attack.toLocaleString()}
                        </span>
                        <span>
                          <GiCheckedShield />
                          {repo.defense.toLocaleString()}
                        </span>
                      </div>
                      <div className="repo__stats--right">
                        <span>Difficulty: {repo.difficulty.toLocaleString()}</span>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </FlipMove>
          ) : (
            <p>No available information!</p>
          )}
        </div>
      </ReposStyles>
    </Section>
  );
};

Repos.propTypes = {
  repoData: PropTypes.array.isRequired,
};

export default Repos;


//check