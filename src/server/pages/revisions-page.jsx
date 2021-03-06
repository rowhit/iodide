import React from 'react';
import styled from 'react-emotion';
import Settings from '@material-ui/icons/Settings'
import MoreHoriz from '@material-ui/icons/MoreHoriz'

import PageBody from '../components/page-body';
import Header from '../components/header';
import Table from '../components/table';
import { MediumUserName } from '../components/user-name';
import fetchWithCSRFToken from '../../shared/fetch-with-csrf-token';
import NotebookActionsMenu from '../components/notebook-actions-menu';
import RevisionActionsMenu from '../components/revision-actions-menu';
import { BodyIconStyle, ActionsContainer } from '../style/icon-styles'

const RevisionsPageHeader = styled('h2')`
span {
  font-style: italic;
  color: gray;
  font-weight: 300;
}

a {
  text-decoration: none;
  color:black;
}

a:hover {
  text-decoration: underline;
}
`

export default class RevisionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { revisions: this.props.revisions };
    this.onDeleteNotebook = this.onDeleteNotebook.bind(this);
    this.onDeleteRevision = this.onDeleteRevision.bind(this);
  }

  onDeleteNotebook() {
    window.location = `/${this.props.userInfo.name}/`;
  }

  onDeleteRevision(revisionID) {
    if (this.state.revisions.length === 1) {
      // If we just deleted the last revision, let's delete the notebook.
      fetchWithCSRFToken(`/api/v1/notebooks/${this.props.ownerInfo.notebookId}/`, {
        method: 'DELETE',
      }).then(this.onDeleteNotebook);
    } else {
      const revisions = this.state.revisions.filter(r => r.id !== revisionID);
      this.setState({ revisions });
    }
  }

  render() {
    const isCurrentUsersPage = (this.props.ownerInfo.username === this.props.userInfo.name);
    return (
      <div>
        <Header userInfo={this.props.userInfo} />
        <PageBody>
          <RevisionsPageHeader>
            <a href={`/notebooks/${this.props.ownerInfo.notebookId}`}>
              {this.props.ownerInfo.title}
            </a> <span> / revisions</span>
          </RevisionsPageHeader>
          <MediumUserName
            username={this.props.ownerInfo.username}
            fullName={this.props.ownerInfo.full_name}
            avatar={this.props.ownerInfo.avatar}
          />
          {
            isCurrentUsersPage &&
            <ActionsContainer>
              <NotebookActionsMenu
                triggerElement={<Settings
                  style={{ width: BodyIconStyle.width }}
                  className={BodyIconStyle}
                />}
                isUserAccount={isCurrentUsersPage}
                hideRevisions
                placement="right-start"
                notebookID={this.props.ownerInfo.notebookId}
                notebookTitle={this.props.ownerInfo.title}
                onDelete={this.onDeleteNotebook}
              />
            </ActionsContainer>
          }
          <h3>Revisions</h3>
          <Table>
            <tbody>
              <tr>
                <th>When</th>
                <th>Title</th>
                {isCurrentUsersPage ? <th>Actions</th> : undefined}
              </tr>
              {
                        this.state.revisions.map((r, i) => (
                          <tr key={r.id}>
                            <td><a href={`/notebooks/${r.notebookId}/?revision=${r.id}`}>{r.date.slice(0, 19)}</a></td>
                            <td>
                              <a href={`/notebooks/${r.notebookId}/?revision=${r.id}`}>
                                { (i > 0 && this.state.revisions[i].title === this.state.revisions[i - 1].title) ? '-' : r.title }
                              </a>
                            </td>
                            {
                                isCurrentUsersPage ?
                                  <td>
                                    <ActionsContainer>
                                      <RevisionActionsMenu
                                        triggerElement={<MoreHoriz className={BodyIconStyle} />}
                                        notebookID={r.notebookId}
                                        revisionID={r.id}
                                        revisionTitle={r.title}
                                        notebookTitle={this.props.ownerInfo.notebookId}
                                        onDelete={this.onDeleteRevision}
                                      />
                                    </ActionsContainer>
                                  </td> :
                              undefined
                              }
                          </tr>
                        ))
                    }
            </tbody>
          </Table>
        </PageBody>
      </div>
    )
  }
}
