import React from 'react';
import { Button, Select } from 'antd';
import './index.less';

const Option = Select.Option;

class PaginationSimple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0, // 当前页码
      pageSize: 20, // 当前分页数量
      total: 0, // 总数量
      pageCount: 0, // 总的页数
      showTotal: false, // 是否展示总数
      paSizeList: [
        10,
        20,
        40,
        60
      ], // 分页数量配置
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.page,
      pageSize: nextProps.pageSize,
      total: nextProps.total,
      pageCount: nextProps.pageCount,
      showTotal: nextProps.showTotal,
    });
  }
  // 分页数量变动
  selectChange(pageSize) {
    this.setState({
      pageSize,
    }, () => {
      try {
        this.props.pageAndSizeChange(1, pageSize);
      } catch (err) {
        // dsd
      }
    });
  }
  // 上一页
  prePageClick() {
    const { page, pageSize } = this.state;
    this.setState({
      page: page - 1,
    }, () => {
      try {
        this.props.pageAndSizeChange(page, pageSize);
      } catch (err) {
        // dsd
      }
    });
  }
  // 下一页
  nextPageClick() {
    const { page, pageSize } = this.state;
    this.setState({
      page: page + 1,
    }, () => {
      try {
        this.props.pageAndSizeChange(page, pageSize);
      } catch (err) {
        // dsd
      }
    });
  }

  render() {
    const {
      page, pageCount, pageSize, total, paSizeList, showTotal
    } = this.state;
    return (
      <div className="pagination-simple-wrap">
        <Button
          className="pagination-simple-pre"
          disabled={page <= 1}
          onClick={() => this.prePageClick()}
        >
          &lt; 上一页
        </Button>
        <Button className="pagination-simple-cur">
          第
          {page}
          页
        </Button>
        <Button
          className="pagination-simple-next"
          disabled={page >= pageCount}
          onClick={() => this.nextPageClick()}
        >
          下一页 &gt;
        </Button>
        <Select className="pagination-simple-select"
          showArrow
          showSearch
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onChange={v => this.selectChange(v)}
          value={`${pageSize}` || undefined}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {
            paSizeList.map(item => {
              return (
                <Option
                  key={item}
                  value={`${item}`}
                  className="select-item"
                >
                  { item }
                  条/页
                </Option>
              );
            })
          }
        </Select>
        {
          showTotal ? (
            <span className="pagination-simple-text">
              总共&nbsp;
              {total}
              &nbsp;条
            </span>
          ) : ''
        }
      </div>
    );
  }
}

export default PaginationSimple;
