import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Meta from 'react-helmet';
import { find } from 'lodash';
import { fetchGnomesIfNeeded } from '../../actions/gnomes';
import Loading from '../../components/Loading/Loading';

if (process.env.WEBPACK) {
  require('./GnomePage.css'); // eslint-disable-line global-require
}

export class GnomePage extends Component {
  static getMeta(name) {
    return {
      title: `Gnome - ${name}`,
      link: [
        {
          rel: 'canonical',
          href: `http://localhost:3000/gnome/${name}`
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
  static getGnome(props) {
    if (isNaN(props.params.gnomeID)) {
      const gnomeName = props.params.gnomeID || '';
      return find(props.gnomes, { name: gnomeName }) || {};
    }
    const gnomeID = parseInt(props.params.gnomeID) || 0;
    return find(props.gnomes, { id: gnomeID }) || {};
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchGnomesIfNeeded());
  }
  render() {
    const gnome = GnomePage.getGnome(this.props);
    const isEmpty = gnome === {};
    const { isFetching } = this.props;
    const friends = gnome.friends ? gnome.friends : [];
    const professions = gnome.professions ? gnome.professions : [];
    const head = GnomePage.getMeta(gnome.name);
    return (
      <div data-test="GnomePage">
        <Meta
          title={head.title}
          description={head.description}
          link={head.link}
          meta={head.meta}
        />
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-category" data-test="GnomeName">{gnome.name}</h5>

              </div>
              <div className="card-body">
                <div className="chart-area">
                  {isEmpty
                  ? (isFetching ? <Loading /> : <h4 className="HomePage-message">Empty :(</h4>)
                  : <img src={gnome.thumbnail} alt="..." style={{ maxHeight: '500px' }} />
                }
                </div>
              </div>
              <div className="card-footer">
                <div className="stats">
                  <div className="row">
                    <div className="left col-xs-6">
                      <label>Height:</label>
                      {Math.round(parseInt(gnome.height), -1)}
                    </div>
                    <div className="col-xs-6">
                      <label >Age:</label>
                      {gnome.age}

                    </div>
                  </div>
                  <div className="row">
                    <div className="left col-xs-6">
                      <label>Weight:</label>
                      {Math.round(parseInt(gnome.weight), -1)}
                    </div>
                    <div className="col-xs-6">
                      <label >Hair:</label>
                      {gnome.hair_color}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12 card-title">
                    <h5>Professions</h5>
                  </div>
                  <div className="container">
                    <div className="row Profs">
                      {professions ? professions.map((profession, index) =>
                        <div className="col-sm-6" key={index}>
                          <Link to={`/profession/${profession}`}>
                            {profession}
                          </Link>
                        </div>
                      ) : <div>Unemployeed :(</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12 card-title">
                    <h5>Friends</h5>
                  </div>
                  <div className="container">
                    {friends ? friends.map((friend, index) =>
                      <div className="col-md-12" key={index}>
                        <Link to={`/gnome/${friend}`}>
                          {friend}
                        </Link>
                      </div>
                      ) : <div>Need some friends :(</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { gnomes = [], isFetching = false, lastUpdated } = state;
  return {
    gnomes,
    isFetching,
    lastUpdated
  };
};

GnomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(GnomePage);
