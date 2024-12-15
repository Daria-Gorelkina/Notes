import React from "react";

export default class Sorted extends React.Component {
    handleSortClick = () => {
        this.props.onSortToggle();
    };

    handleSortTagsClick = () => {
        this.props.onSortTags();
    };
    render() {
        return <div className="p-3 sorted-style">
                    <h5 className="h5_style">Сортировка</h5>
                    <ul className="list-unstyled">
                        <li><a href="#" className="text-decoration-none link-dark" onClick={this.handleSortClick}>По дате</a></li>
                        <li><a href="#" className="text-decoration-none link-dark" onClick={this.handleSortTagsClick}>По тегам</a></li>
                    </ul>
                </div>

    }
}
