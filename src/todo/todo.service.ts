import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    try {
      const todo = this.todoRepository.create({
        details: createTodoDto.details,
        dueDate: createTodoDto.dueDate,
      });
      await this.todoRepository.save(todo);
      return { success: true, message: 'Todo created successfully', todo };
    } catch (error) {
      console.error('Error creating todo:', error.message);
      return { success: false, message: 'Error creating todo' };
    }
  }

  async findAll(
    page: number,
    limit: number,
    status?: string,
    priority?: string,
    startDate?: string,
    endDate?: string,
  ) {
    try {
      const pageSize = limit;
      const skip = (page - 1) * pageSize;

      const where: any = {
        isActive: true
      };

      if (status) {
        where.status = status;
      }

      if (priority) {
        where.priority = priority;
      }

      if (startDate && endDate) {
        where.dueDate = Between(startDate, endDate);
        where.dueDate = MoreThanOrEqual(startDate);
      } else if (endDate) {
        where.dueDate = LessThanOrEqual(endDate);
      }

      const [todos, total] = await this.todoRepository.findAndCount({
        where,
        skip,
        take: pageSize,
      });

      const totalPages = Math.ceil(total / pageSize);

      return {
        success: true,
        todos,
        total,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error('Error fetching todos:', error.message);
      return { success: false, message: 'Error fetching todos' };
    }
  }

  async findOne(id: number) {
    try {
      const todo = await this.todoRepository.findOne({ where: { id, isActive : true } });
      if (!todo) {
        return { success: false, message: `Todo with ID ${id} not found` };
      }
      return { success: true, todo };
    } catch (error) {
      console.error(`Error fetching todo with ID ${id}:`, error.message);
      return { success: false, message: `Error fetching todo with ID ${id}` };
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    try {
      const { status, priority, details } = updateTodoDto;
      const updatedTodo = { status, priority, details };

      const updateResult = await this.todoRepository.update(id, updatedTodo);

      if (updateResult.affected === 0) {
        return {
          success: false,
          message: `Todo with ID ${id} not found for update`,
        };
      }

      const updatedTodoData = await this.findOne(id);
      return {
        success: true,
        message: 'Todo updated successfully',
        todo: updatedTodoData.todo,
      };
    } catch (error) {
      console.error(`Error updating todo with ID ${id}:`, error.message);
      return { success: false, message: `Error updating todo with ID ${id}` };
    }
  }

  async remove(id: number) {
    try {
      const deleteResult = await this.todoRepository.update(id, {
        isActive: false,
      });

      if (deleteResult.affected === 0) {
        return {
          success: false,
          message: `Todo with ID ${id} not found for deletion`,
        };
      }

      return {
        success: true,
        message: `Todo with ID ${id} deleted successfully`,
      };
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error.message);
      return { success: false, message: `Error deleting todo with ID ${id}` };
    }
  }
}
