import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createBookGroup, deleteBookGroup, getBookGroups, patchBookGroup } from '../api/book-groups-api'
import Auth from '../auth/Auth'
import { BookGroup } from '../types/BookGroup'

interface BookGroupsProps {
  auth: Auth
  history: History
}

interface BookGroupsState {
  bookGroups: BookGroup[]
  newBookGroupName: string
  newDescription: string
  loadingBookGroups: boolean
}

export class BookGroups extends React.PureComponent<BookGroupsProps, BookGroupsState> {
  state: BookGroupsState = {
    bookGroups: [],
    newBookGroupName: '',
    newDescription: '',
    loadingBookGroups: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookGroupName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value })
  }

  onEditButtonClick = (bookGroupId: string) => {
    this.props.history.push(`/bookGroups/${bookGroupId}/edit`)
  }

  onBookGroupCreate = async () => {
    try {
      const newBookGroup = await createBookGroup(this.props.auth.getIdToken(), {
        name: this.state.newBookGroupName,
        description: this.state.newDescription
      })
      console.log(newBookGroup)
      this.setState({
        bookGroups: [...this.state.bookGroups, newBookGroup],
        newBookGroupName: ''
      })
    } catch {
      alert('BookGroup creation failed')
    }
  }

  onBookGroupDelete = async (bookGroupId: string) => {
    try {
      await deleteBookGroup(this.props.auth.getIdToken(), bookGroupId)
      this.setState({
        bookGroups: this.state.bookGroups.filter(bookGroup => bookGroup.bookGroupId !== bookGroupId)
      })
    } catch {
      alert('BookGroup deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const bookGroups = await getBookGroups(this.props.auth.getIdToken())
      console.log()
      this.setState({
        bookGroups,
        loadingBookGroups: false
      })
    } catch (e) {
      alert(`Failed to fetch bookGroups: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">BOOK GROUPS</Header>

        {this.renderCreateBookGroupInput()}
        {this.renderHeader()}
        {this.renderBookGroups()}
      </div>
    )
  }

  renderCreateBookGroupInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Book name"
            onChange={this.handleNameChange}
          />

        </Grid.Column>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Book description"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Button color='blue' onClick={() => this.onBookGroupCreate()}>
            CREATE NEW BOOK
          </Button>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderHeader() {
    return (
      <Grid padded>
      <Grid.Row>
        <Grid.Column width={3} style={{ marginRight: 13 }}>
          <Header as="h4">Book Name</Header>
        </Grid.Column>
        <Grid.Column width={3} style={{ marginRight: 13 }}>
          <Header as="h4">Book Description</Header>
        </Grid.Column>
        <Grid.Column width={4} style={{ marginRight: 13 }}>
          <Header as="h4">Image</Header>
        </Grid.Column>
        <Grid.Column width={3} style={{ marginRight: 16 }}>
          <Header as="h4">Date</Header>
        </Grid.Column>
        <Grid.Column width={2}>
          <Header as="h4">Action</Header>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
      </Grid>
    )
  }

  renderBookGroups() {
    if (this.state.loadingBookGroups) {
      return this.renderLoading()
    }

    return this.renderBookGroupsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading BOOKGROUP's
        </Loader>
      </Grid.Row>
    )
  }

  renderBookGroupsList() {
    return (
      <Grid padded>
        {this.state.bookGroups.map((bookGroup, pos) => {
          return (
            <Grid.Row key={bookGroup.bookGroupId}>
              <Grid.Column width={3} verticalAlign="top">
                <h5>{bookGroup.name}</h5>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {bookGroup.description}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {bookGroup.attachmentUrl && (
                  <Image src={bookGroup.attachmentUrl} onError={(event: { target: { style: { display: string } } }) => event.target.style.display = 'none'} alt=" This is book image!" size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {bookGroup.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(bookGroup.bookGroupId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onBookGroupDelete(bookGroup.bookGroupId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
