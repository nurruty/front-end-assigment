import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import LazyLoad from 'react-lazyload';
import _ from 'lodash';

if (process.env.WEBPACK) {
  require('./ProfessionList.css'); // eslint-disable-line global-require
}

const ProfessionList = (props) => {
  const [state, setState] = useState({ filter: '' });

  const handleChange = (e) => {
    setState({ filter: e.target.value });
  };

  let list = [];
  if (props.professions) {
    list = state.filter.length > 0
    ? _.filter(Object.keys(props.professions), p => {
      try{
        return p.match(state.filter) != null;
      }catch(e){
        return true
      }
    })
    : list = Object.keys(props.professions);
  }

  return (
    <div className="container" data-test="ProfessionList">
      <div className="row">
        <div className="col-12">
          <form role="form">
            <div className="form-group">
              <input type="text" onChange={handleChange} className="input" id="iconified" placeholder="Search professions..." />
            </div>
          </form>
        </div>
        <div className="col-12">
          <ul className="list">
            {list.map((profession, i) =>
              <LazyLoad key={i}>
                <Link to={`profession/${profession}`} data-test="Link">
                  <li key={i} className="list-group-item ProfessionList-gnome">
                    <div className="row">
                      <div className="col-4" style={{padding: '10'}}>
                        { profession }
                      </div>            
                      <div className="avatar-group">
                        {
                          _.take(props.professions[profession], 6).map((g, i) =>                           
                            <span key={i} title={g.name} className="avatar rounded-circle tail">
                                <img alt={g.name} src={g.thumbnail} className="avatar" />
                            </span> 
                          )
                        }
                        <span href="#!" className="avatar last">
                            {props.professions[profession].length - 6}+
                        </span> 
                      </div>
                    </div>
                  </li>
                </Link>
              </LazyLoad>
            )}
          </ul>
        </div>
      </div>
    </div>
    );
};

ProfessionList.propTypes = {
  professions: PropTypes.object.isRequired
};

export default ProfessionList;
