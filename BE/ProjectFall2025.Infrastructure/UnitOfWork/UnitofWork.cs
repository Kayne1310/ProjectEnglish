using MongoDB.Driver;
using ProjectFall2025.Application.UnitOfWork;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using ProjectFall2025.Infrastructure.Repositories.Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.UnitOfWork
{
    public class UnitofWork : IUnitofWork
    {
        private readonly MongoDbContext _dbContext;

        private IClientSessionHandle _session; // Lưu session để quản lý transaction

        public UnitofWork(MongoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Bắt đầu transaction
        public async Task StartTransactionAsync()
        {
            _session = await _dbContext.Database.Client.StartSessionAsync();
            _session.StartTransaction();
        }

        // Commit transaction
        public async Task<int> CommitTransactionAsync()
        {
            if (_session == null) throw new InvalidOperationException("Transaction has not been started.");
            try
            {
                await _session.CommitTransactionAsync();
                return 1; // Thành công
            }
            catch
            {
                await _session.AbortTransactionAsync();
                throw;
            }
        }

        // Hủy transaction nếu có lỗi
        public async Task AbortTransactionAsync()
        {
            if (_session != null)
            {
                await _session.AbortTransactionAsync();
            }
        }

        // Dispose session để giải phóng tài nguyên
        public void DisposeTransaction()
        {
            _session?.Dispose();
            _session = null;
        }

        // Trả về session hiện tại (dùng cho Repository)
        public IClientSessionHandle GetSession()
        {
            if (_session == null)
                throw new InvalidOperationException("Transaction has not been started.");
            return _session;
        }

        // Dispose toàn bộ UnitOfWork
        public void Dispose()
        {
            DisposeTransaction();
        }

    }

}
