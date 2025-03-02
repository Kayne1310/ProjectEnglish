using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.UnitOfWork
{
    public interface IUnitofWork : IDisposable
    {
        // Quản lý transaction
        Task StartTransactionAsync();
        Task<int> CommitTransactionAsync();
        Task AbortTransactionAsync();
        void DisposeTransaction();

        // Trả về session hiện tại để dùng trong Repository
        IClientSessionHandle GetSession();
    }
}
