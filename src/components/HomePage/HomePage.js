import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Meta from 'react-helmet';
import { fetchGnomesIfNeeded } from '../../actions';
import InfoCard from '../InfoCard/InfoCard';
import GnomeCard from '../GnomeCard/GnomeCard';
import { Link } from 'react-router';
import Loading from '../Loading/Loading';

if (process.env.WEBPACK) {
  require('./HomePage.css'); // eslint-disable-line global-require
}

export class HomePage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    gnomes: PropTypes.arrayOf(PropTypes.object.isRequired),
    professions: PropTypes.object.isRequired,
    important: PropTypes.arrayOf(PropTypes.object.isRequired)
  }
  static getMeta() {
    return {
      title: 'GnomeBook',
      link: [
        {
          rel: 'canonical',
          href: 'http://localhost:3000'
        }
      ],
      meta: [
        {
          charset: 'utf-8'
        },
        {
          name: 'description', content: ''
        }
      ]
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchGnomesIfNeeded());
  }
  render() {
    const { gnomes, professions, important } = this.props;
    const isEmpty = gnomes.length === 0;
    const head = HomePage.getMeta();
    return (
      <div className="HomePage">
        <Meta
          title={head.title}
          description={head.description}
          link={head.link}
          meta={head.meta}
        />
        <div className="row">
          <div className="col-lg-6">
            <Link to={'/gnomes'}>
              <InfoCard title="Total Population" data={gnomes.length} />
            </Link>
          </div>
          <div className="col-lg-6">
            <Link to={'/professions'}>
              <InfoCard title="Different Professions" data={Object.keys(professions).length} />
            </Link>
          </div>
        </div>

        <h3>Relevant Gnomes</h3>
        <div className="row">
          <div className="col-lg-4">
            {isEmpty ? <Loading /> :
              <GnomeCard gnome={important[0]} />
            }
          </div>
          <div className="col-lg-4">
          {isEmpty ? <Loading /> :
              <GnomeCard gnome={important[1]} />
            }
          </div>
          <div className="col-lg-4">
          {isEmpty ? <Loading /> :
              <GnomeCard gnome={important[2]} />
            } 
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { gnomes = [], professions = [], important = [], isFetching = false, lastUpdated } = state;
  return {
    gnomes,
    professions,
    important,
    isFetching,
    lastUpdated
  };
};


export default connect(mapStateToProps)(HomePage);
