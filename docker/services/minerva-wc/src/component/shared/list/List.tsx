import { useState, useEffect } from 'preact/hooks';
import "./list.scss";
import CheckboxCheckedIcon from "../../../svg/CheckboxCheckedIcon";
import CheckboxUncheckedIcon from "../../../svg/CheckboxUncheckedIcon";
import QueryInputDatasourceItem from '../../queryInput/QueryInputDatasource';

interface ListItems {
  id: number | string;
  content: string;
  selected: boolean;
  datasource?: Array<File>;
}

interface ListComponentProps {
  listItems: ListItems[];
  onListItemSelect: (id: number | string) => void;
  onSelectAll: (selectAll: boolean) => void;
  onListItemClick: (query_id: number | string) => void;
}

const List = ({ listItems, onListItemSelect, onSelectAll, onListItemClick }: ListComponentProps) => {
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    const allSelected = listItems.every(item => item.selected);
    setAllSelected(allSelected);
  }, [listItems]);

  const handleListItemChange = (id: number | string) => {
    onListItemSelect(id);
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !allSelected;
    setAllSelected(newSelectAll);
    onSelectAll(newSelectAll);
  };

  const handleListItemClick = (id: number | string) => (event: MouseEvent) => {
    event.stopPropagation();
    onListItemClick(id);
  };

  return (
    <div className="MinervaListRoot">
      <div className="MinervaListMain">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={handleSelectAllChange}
          className="MinervaList-checkbox"
        />
        <div className="MinervaList-checkbox-icons" onClick={handleSelectAllChange}>
          {allSelected ? <CheckboxCheckedIcon /> : <CheckboxUncheckedIcon />}
        </div>
        <span className="MinervaListSelectAllLabel">All</span>
      </div>
      <hr className="MinervaList-horizontal-line" />

      <ul className="MinervaList-items">
        {listItems.map(listItem => (
          <li key={listItem.id} className="MinervaListItem">
            <input
              type="checkbox"
              checked={listItem.selected}
              onChange={() => handleListItemChange(listItem.id)}
              className="MinervaListItem-checkbox"
            />
            <div className="MinervaListItem-checkbox-icons" onClick={() => handleListItemChange(listItem.id)}>
              {listItem.selected ? <CheckboxCheckedIcon /> : <CheckboxUncheckedIcon />}
            </div>
            {listItem.content !== "" ? (
              <a
                className="MinervaListItemLabel"
                onClick={handleListItemClick(listItem.id)}
              >
                {listItem.content}
              </a>
            ) : (
              <div onClick={handleListItemClick(listItem.id)}>
                <QueryInputDatasourceItem queryDatasourceList={listItem?.datasource} allowFileRemove={false} enablePreview={false} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;