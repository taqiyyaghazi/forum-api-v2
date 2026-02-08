import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper';
import pool from '../../database/postgres/pool';
import createServer from '../createServer';
import container from '../../container';
import request from 'supertest';

describe('Thread', () => {
  const user = {
    username: 'ghazi',
    password: 'secret',
    fullname: 'Ghazi',
  };
  let accessToken: string;

  afterEach(async () => {
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

  describe('when POST /threads', () => {
    it('should throw error 401 when if not contain access token', async () => {
      const app = await createServer(container);

      const response = await request(app).post('/threads').send({
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
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'A Thread Title',
        });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should throw error 400 when request payload not meet data type specification', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'A Thread Title',
          body: 123,
        });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      );
    });

    it('should response 201 and new thread', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'A Thread Title',
          body: 'Thread body content',
        });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads', () => {
    it('should response 200 if threads found', async () => {
      const app = await createServer(container);

      const threadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'A Thread Title',
          body: 'Thread body content',
        });

      const commentResponse = await request(app)
        .post(`/threads/${threadResponse.body.data.addedThread.id}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'A comment content',
        });

      await request(app)
        .post(
          `/threads/${threadResponse.body.data.addedThread.id}/comments/${commentResponse.body.data.addedComment.id}/replies`,
        )
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'A reply content',
        });

      await request(app)
        .put(
          `/threads/${threadResponse.body.data.addedThread.id}/comments/${commentResponse.body.data.addedComment.id}/likes`,
        )
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      const response = await request(app).get(
        `/threads/${threadResponse.body.data.addedThread.id}`,
      );

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread).toBeDefined();
      expect(response.body.data.thread.comments).toHaveLength(1);
      expect(response.body.data.thread.comments[0]).toBeDefined();
      expect(response.body.data.thread.comments[0].username).toBe(
        user.username,
      );
      expect(response.body.data.thread.comments[0].content).toBe(
        'A comment content',
      );
      expect(response.body.data.thread.comments[0].replies).toHaveLength(1);
      expect(response.body.data.thread.comments[0].replies[0]).toBeDefined();
      expect(response.body.data.thread.comments[0].replies[0].username).toBe(
        user.username,
      );
      expect(response.body.data.thread.comments[0].replies[0].content).toBe(
        'A reply content',
      );
      expect(response.body.data.thread.comments[0].likeCount).toBe(1);
    });
  });
});
