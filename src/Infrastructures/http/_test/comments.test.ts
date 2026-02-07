import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper';
import pool from '../../database/postgres/pool';
import createServer from '../createServer';
import container from '../../container';
import request from 'supertest';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';

describe('Comments', () => {
  const user = {
    username: 'ghazi',
    password: 'secret',
    fullname: 'Ghazi',
  };
  let accessToken: string;

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    const app = await createServer(container);

    await request(app).post('/users').send(user);

    const loginResponse = await request(app).post('/authentications').send({
      username: user.username,
      password: user.password,
    });

    accessToken = loginResponse.body.data.accessToken;
  });

  describe('when POST /threads/:threadId/comments', () => {
    let threadId: string;

    beforeEach(async () => {
      const app = await createServer(container);

      const threadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'A Thread Title',
          body: 'Thread body content',
        });

      threadId = threadResponse.body.data.addedThread.id;
    });

    it('should throw error 401 when if not contain access token', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .send({
          title: 'A Thread Title',
          body: 'Thread body content',
        });

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Missing authentication');
    });

    it('should throw error 400 when request payload not contain needed property', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should throw error 400 when request payload not meet data type specification', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 123,
        });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai',
      );
    });

    it('should response 201 and new thread', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'A comment content',
        });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/:threadId/comments/:commentId', () => {
    let threadId: string;
    let commentId: string;

    beforeEach(async () => {
      const app = await createServer(container);

      const threadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'A Thread Title',
          body: 'Thread body content',
        });

      threadId = threadResponse.body.data.addedThread.id;

      const commentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'A comment content',
        });

      commentId = commentResponse.body.data.addedComment.id;
    });

    it('should throw error 401 when if not contain access token', async () => {
      const app = await createServer(container);

      const response = await request(app).delete(
        `/threads/${threadId}/comments/${commentId}`,
      );

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Missing authentication');
    });

    it('should response 200 when comment deleted', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(comment).toBeDefined();
      expect(comment?.is_deleted).toBe(true);
    });
  });
});
