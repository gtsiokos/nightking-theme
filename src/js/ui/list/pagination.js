import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class Pagination extends React.Component {
  static propTypes = {
    totalPages: PropTypes.number.isRequired,
    activePage: PropTypes.number,
    onPageChange: PropTypes.func.isRequired
  };

  onClick(page, event) {
    event.preventDefault();

    this.props.onPageChange(page);
  }

  calculatePageNumbers(activePage, totalPages) {
    if (totalPages <= 1) {
      return [];
    }
    if (totalPages <= 10) {
      return Array(totalPages)
        .fill()
        .map((_, i) => i + 1);
    }

    if (totalPages > 10 && activePage <= 8) {
      return Array(8)
        .fill()
        .map((_, i) => i + 1)
        .concat(['...', totalPages]);
    }

    if (totalPages - activePage <= 7) {
      return [1, '...']
        .concat(Array(8)
        .fill()
        .map((_, i) => totalPages - 7 + i));
    }

    return [1, '...']
      .concat(Array(3).fill().map((_, i) => activePage - 2 + i))
      .concat(Array(4).fill().map((_, i) => activePage + i + 1))
      .concat(['...', totalPages]);
  }

  renderBackIcon(activePage, totalPages) {
    if (totalPages <= 1) return '';

    let styles = this.props.styles;

    if (activePage === 1) {
      return (
        <li className={`${styles.paginationItem} ${styles.paginationIcon}`}>
          <span className='fa fa-arrow-left'></span>
        </li>
      );
    }

    return (
      <li className={`${styles.paginationItem} ${styles.paginationItemEnabled} ${styles.paginationIcon}`} onClick={this.onClick.bind(this, activePage - 1)}>
          <span className='fa fa-arrow-left'></span>
      </li>
    );
  }

  renderForwardIcon(activePage, totalPages) {
    if (totalPages <= 1) return '';

    let styles = this.props.styles;

    if (activePage === totalPages) {
      return (
        <li className={`${styles.paginationItem} ${styles.paginationIcon}`}>
          <span className='fa fa-arrow-right'></span>
        </li>
      );
    }

    return (
      <li className={`${styles.paginationItem} ${styles.paginationItemEnabled} ${styles.paginationIcon}`} onClick={this.onClick.bind(this, activePage + 1)}>
        <span className='fa fa-arrow-right'></span>
      </li>
    );
  }

  render() {
    let {activePage, totalPages} = this.props;
    let numbers = this.calculatePageNumbers(activePage, totalPages);
    let styles = this.props.styles;

    return (
      <div className={`no-select ${styles.pagination}`}>
        <ul>
          {this.renderBackIcon(activePage, totalPages)}
          {
            numbers.map((num, i) => {
              let is_active = !!(activePage === num);

              return (
                <li
                  key={i}
                  className={`${styles.paginationItem} ${is_active ? styles.paginationItemActive : styles.paginationItemEnabled}`}
                  onClick={this.onClick.bind(this, num)}>
                  {num}
                </li>
              );
            })
          }
          {this.renderForwardIcon(activePage, totalPages)}
        </ul>
      </div>
    );
  }
}

export default Pagination;
