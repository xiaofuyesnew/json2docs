import React from 'react';
import { BaseGenerator } from '@json2docs/core';

export class ReactRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: props.document || null
    };
  }

  render() {
    const { document } = this.state;

    if (!document) {
      return <div>No document provided</div>;
    }

    return (
      <div className="json2docs-react-renderer">
        <h1>{document.metadata?.title || 'Document'}</h1>
        <div className="content">
          {document.content?.map((item, index) => (
            <div key={index} className="content-item">
              {this.renderContentItem(item)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderContentItem(item) {
    switch (item.type) {
      case 'text':
        return <p>{item.content}</p>;
      case 'heading':
        return <h2>{item.content}</h2>;
      case 'list':
        return (
          <ul>
            {item.items?.map((listItem, index) => (
              <li key={index}>{listItem}</li>
            ))}
          </ul>
        );
      default:
        return <div>{item.content}</div>;
    }
  }
}

export default ReactRenderer;