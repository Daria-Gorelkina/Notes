import React from "react";

export default class Sorted extends React.Component {
    render() {
        return <div className="p-3">
                    <h5>Сортировка</h5>
                    <ul className="list-unstyled">
                        <li><a href="#" className="text-decoration-none link-dark">По дате</a></li>
                        <li><a href="#" className="text-decoration-none link-dark">По тегам</a></li>
                    </ul>
                </div>

    }
}
